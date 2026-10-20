const fs = require('fs');
const https = require('https');

// Read all image URLs from menu.ts
const menuContent = fs.readFileSync('src/data/menu.ts', 'utf8');
const urls = [...menuContent.matchAll(/image:\s*'(https:\/\/images\.unsplash\.com\/[^']+)'/g)].map(m => m[1]);

console.log(`Found ${urls.length} URLs in menu.ts`);

async function checkUrl(url) {
  return new Promise((resolve) => {
    const req = https.get(url, { headers: { 'User-Agent': 'Mozilla/5.0' } }, (res) => {
      resolve({ url, status: res.statusCode });
      res.resume();
    });
    req.on('error', (e) => resolve({ url, status: 'ERROR' }));
    req.setTimeout(8000, () => { req.destroy(); resolve({ url, status: 'TIMEOUT' }); });
  });
}

async function run() {
  const results = await Promise.all(urls.map(checkUrl));
  const errors = results.filter(r => r.status !== 200);
  if (errors.length === 0) {
    console.log(`✅ All ${urls.length} URLs are working!`);
  } else {
    console.log(`❌ ${errors.length} broken URLs:`);
    errors.forEach(e => {
      const id = e.url.split('/').pop().split('?')[0];
      console.log(`  ${e.status}: ${id}`);
    });
    console.log(`✅ ${urls.length - errors.length} working`);
  }
}
run();
