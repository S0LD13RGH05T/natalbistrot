const fs = require('fs');
const https = require('https');

const menuContent = fs.readFileSync('src/data/menu.ts', 'utf8');
const urls = [...menuContent.matchAll(/image:\s*'([^']+)'/g)].map(m => m[1]);

async function checkUrl(url) {
  return new Promise((resolve) => {
    https.get(url, (res) => {
      resolve({ url, status: res.statusCode });
    }).on('error', (e) => {
      resolve({ url, status: e.message });
    });
  });
}

async function run() {
  for (const url of new Set(urls)) {
    const result = await checkUrl(url);
    if (result.status !== 200) {
      console.log(`Error ${result.status}: ${url}`);
    } else {
      console.log(`OK 200: ${url}`);
    }
  }
}
run();
