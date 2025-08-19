const express = require('express');
const cors = require('cors');
const fetch = require('node-fetch');

const app = express();
app.use(cors());
app.use(express.json());

const people = [
  "Greta Thunberg",
  "Malala Yousafzai",
  "Elon Musk",
  "Bill Gates",
  "Jane Goodall",
  "David Attenborough",
  "Angela Merkel",
  "Barack Obama",
  "Jacinda Ardern",
  "Oprah Winfrey",
  "Neil deGrasse Tyson",
  "Emma Watson"
];

// Helper: fetch Wikipedia summary & image
async function getWikiSummary(name) {
  const title = encodeURIComponent(name.replace(/ /g, "_"));
  const url = `https://en.wikipedia.org/api/rest_v1/page/summary/${title}`;
  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error('Not found');
    const data = await res.json();
    return {
      name: data.title || name,
      summaryLength: data.extract ? data.extract.length : 0,
      hasImage: !!data.thumbnail?.source,
      link: data.content_urls?.desktop?.page || `https://en.wikipedia.org/wiki/${title}`
    };
  } catch {
    return { name, summaryLength: 0, hasImage: false, link: `https://en.wikipedia.org/wiki/${title}` };
  }
}

// Helper: fetch Wikipedia pageviews
async function getWikiPageviews(name) {
  const title = encodeURIComponent(name.replace(/ /g, "_"));
  const endDate = new Date();
  const startDate = new Date(endDate);
  startDate.setDate(endDate.getDate() - 30); // last 30 days

  const formatDate = (d) => d.toISOString().slice(0,10).replace(/-/g, '');
  const url = `https://wikimedia.org/api/rest_v1/metrics/pageviews/per-article/en.wikipedia/all-access/user/${title}/daily/${formatDate(startDate)}/${formatDate(endDate)}`;

  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error('No pageviews');
    const data = await res.json();
    return data.items?.reduce((sum, item) => sum + (item.views || 0), 0) || 0;
  } catch {
    return 0;
  }
}

// Compute ripple score
function calculateRippleScore({ summaryLength, hasImage, reach }) {
  const summaryScore = Math.min(summaryLength, 400) / 400 * 30; // max 30
  const imageScore = hasImage ? 20 : 0; // 20 if image exists
  const reachScore = reach > 0 ? Math.log10(reach + 1) * 50 : 5; // logarithmic reach, +1 to avoid log(0)
  return Math.round(summaryScore + imageScore + reachScore);
}

// Build leaderboard
app.get('/api/leaderboard', async (req, res) => {
  try {
    const results = [];
    for (const person of people) {
      const wiki = await getWikiSummary(person);
      const reach = await getWikiPageviews(person);

      results.push({
        name: wiki.name,
        rippleScore: calculateRippleScore({ summaryLength: wiki.summaryLength, hasImage: wiki.hasImage, reach }),
        metrics: {
          summaryLength: wiki.summaryLength,
          hasImage: wiki.hasImage,
          reach
        },
        link: wiki.link
      });
    }

    const topTen = results.sort((a,b) => b.rippleScore - a.rippleScore).slice(0,10);
    res.json(topTen);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to build leaderboard' });
  }
});

const PORT = 5001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
