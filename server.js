/*
  require() is a function from the require module that takes in a file path and
  searches for the specific module. It prioritizes built in modules, than file
  paths relative to the current file, and finally installed modules from the 
  node_modules directories. Once the module is found, it wraps the content and
  then allows you to access the modules public API.
*/

// import express to use as a framework to make routing and requests easier to handle
const express = require('express');

// require cors (Cross Origin Resource Sharing) to deal with security from browser and 
// be be able to run on two different ports. 
const cors = require('cors');

// Node.js does not have a built in fetch like broswers so in order to call https
// requests and fetch informations from APIs, I need to manually add
// this line to import the node-fetch module
const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args));

const app = express();
const PORT = 5001;
app.use(cors());
app.use(express.json());

// --- Utility Functions ---
const yesterday = () => {
  const d = new Date();
  d.setDate(d.getDate() - 1);
  return {
    year: d.getFullYear(),
    month: String(d.getMonth() + 1).padStart(2, "0"),
    day: String(d.getDate()).padStart(2, "0"),
  };
};

// Fetch top Wikipedia articles for yesterday
async function fetchTopWikipediaArticles(limit = 50) {
  const { year, month, day } = yesterday();
  const url = `https://wikimedia.org/api/rest_v1/metrics/pageviews/top/en.wikipedia/all-access/${year}/${month}/${day}`;
  const res = await fetch(url);
  const data = await res.json();
  return (data.items?.[0]?.articles || []).slice(0, limit);
}

// Get Wikidata QID for a Wikipedia article
async function getWikidataID(article) {
  try {
    const url = `https://en.wikipedia.org/w/api.php?action=query&titles=${article}&prop=pageprops&format=json&origin=*`;
    const res = await fetch(url);
    const data = await res.json();
    const page = Object.values(data.query.pages)[0];
    return page.pageprops?.wikibase_item || null;
  } catch {
    return null;
  }
}

// Check if the Wikidata QID is a living human
async function isLivingHuman(qid) {
  try {
    const url = `https://www.wikidata.org/wiki/Special:EntityData/${qid}.json`;
    const res = await fetch(url);
    if (!res.ok) return false;

    const data = await res.json();
    const entityKey = Object.keys(data.entities)[0];
    const claims = data.entities[entityKey]?.claims;

    const isHuman = claims?.P31?.some(c => c.mainsnak.datavalue.value.id === "Q5");
    if (!isHuman) return false;

    // Exclude historical figures (date of death exists)
    if (claims?.P570) return false;

    return true;
  } catch {
    return false;
  }
}

// Fetch pageviews for last 30 days
async function fetchPageviews(article) {
  try {
    const end = new Date();
    const start = new Date();
    start.setDate(end.getDate() - 30);

    const formatDate = (d) => d.toISOString().slice(0,10).replace(/-/g,'');
    const url = `https://wikimedia.org/api/rest_v1/metrics/pageviews/per-article/en.wikipedia/all-access/user/${article}/daily/${formatDate(start)}/${formatDate(end)}`;
    const res = await fetch(url);
    if (!res.ok) return 0;

    const data = await res.json();
    return data.items?.reduce((sum, item) => sum + (item.views || 0), 0) || 0;
  } catch {
    return 0;
  }
}

// --- NEW: Fetch number of references in Wikipedia article (Depth proxy) ---
async function fetchWikipediaReferences(article) {
  try {
    const url = `https://en.wikipedia.org/w/api.php?action=query&prop=revisions&rvprop=content&rvslots=*&format=json&titles=${article}&origin=*`;
    const res = await fetch(url);
    if (!res.ok) return 0;

    const data = await res.json();
    const page = Object.values(data.query.pages)[0];
    const content = page.revisions?.[0]?.slots?.main?.['*'] || "";

    // Count <ref> tags as proxy for depth
    const refCount = (content.match(/<ref/g) || []).length;
    return refCount;
  } catch {
    return 0;
  }
}

// Fetch duration in days since first Wikipedia revision
async function fetchPageAge(article) {
  try {
    const url = `https://en.wikipedia.org/w/api.php?action=query&format=json&prop=revisions&rvlimit=1&rvdir=newer&titles=${article}&origin=*`;
    const res = await fetch(url);
    const data = await res.json();
    const page = Object.values(data.query.pages)[0];
    const firstRev = page.revisions?.[0]?.timestamp;
    if (!firstRev) return 0;

    const created = new Date(firstRev);
    const now = new Date();
    return Math.floor((now - created) / (1000 * 60 * 60 * 24)); // days
  } catch {
    return 0;
  }
}

// Compute ripple score
function computeRippleScore({ reach, depth, duration }) {
  const cappedDuration = Math.min(duration, 10000); // max ~27 years

  const reachNorm = Math.log10(reach + 1);
  const depthNorm = Math.log10(depth + 1);
  const durationNorm = Math.log10(cappedDuration + 1);

  const score = (reachNorm * 0.5 + depthNorm * 0.3 + durationNorm * 0.2) * 10;
  return Math.round(score * 100) / 100;
}

// --- Main API Route ---
app.get("/api/leaderboard", async (req, res) => {
  try {
    const articles = await fetchTopWikipediaArticles(50);

    // Fetch metrics in parallel
    const results = await Promise.all(
      articles.map(async (art) => {
        const name = decodeURIComponent(art.article.replace(/_/g, " "));
        const qid = await getWikidataID(art.article);
        if (!qid) return null;

        const livingHuman = await isLivingHuman(qid);
        if (!livingHuman) return null;

        const reach = await fetchPageviews(art.article);
        if (reach < 100_000) return null;

        const depth = await fetchWikipediaReferences(art.article);
        const duration = await fetchPageAge(art.article);
        const rippleScore = computeRippleScore({ reach, depth, duration });

        return { name, article: art.article, reach, depth, duration, rippleScore };
      })
    );

    const topPeople = results.filter(Boolean)
                             .sort((a,b) => b.rippleScore - a.rippleScore)
                             .slice(0,10);

    res.json(topPeople);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

app.listen(PORT, () => console.log(`🚀 Ripple API running on http://localhost:${PORT}`));
