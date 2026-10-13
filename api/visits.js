module.exports = async function handler(req, res) {
  try {
    const targetUrl = 'https://hits.sh/lovely-book.vercel.app.svg';
    const response = await fetch(targetUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; LovelysBookVisitorCounter/1.0)'
      }
    });

    if (!response.ok) {
      throw new Error(`hits.sh returned status ${response.status}`);
    }

    const svg = await response.text();
    // Parse hits count from hits.sh SVG
    const match = svg.match(/hits:\s*(\d+)/i) || svg.match(/<text[^>]*>(\d+)<\/text>/i);
    const count = match ? parseInt(match[1], 10) : null;

    res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Content-Type', 'application/json');

    return res.status(200).json({
      success: true,
      count: count !== null ? count : 1,
      source: 'hits.sh'
    });
  } catch (error) {
    if (res.setHeader) {
      res.setHeader('Access-Control-Allow-Origin', '*');
      res.setHeader('Content-Type', 'application/json');
    }
    return res.status(200).json({
      success: false,
      count: null,
      error: error.message
    });
  }
};

module.exports.default = module.exports;
