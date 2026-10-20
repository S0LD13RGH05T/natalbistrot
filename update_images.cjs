const fs = require('fs');
const https = require('https');

const menuPath = 'src/data/menu.ts';
let menuContent = fs.readFileSync(menuPath, 'utf8');

const regex = /image:\s*imageFor\('([^']+)'\)/g;
let match;
const itemsToUpdate = [];

while ((match = regex.exec(menuContent)) !== null) {
  itemsToUpdate.push({ fullMatch: match[0], query: match[1] });
}

async function fetchUnsplashImage(query) {
  return new Promise((resolve) => {
    const url = `https://unsplash.com/s/photos/${encodeURIComponent(query)}`;
    https.get(url, { headers: { 'User-Agent': 'Mozilla/5.0' } }, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        const photoRegex = /https:\/\/images\.unsplash\.com\/photo-[a-zA-Z0-9-]+/g;
        const photos = data.match(photoRegex);
        if (photos && photos.length > 0) {
          // Remove duplicates
          const uniquePhotos = [...new Set(photos)];
          // Usually the first few are profile images or something, but photo- is usually content.
          // Let's grab the first one that appears
          resolve(uniquePhotos[0]);
        } else {
          resolve(null);
        }
      });
    }).on('error', () => resolve(null));
  });
}

async function run() {
  console.log(`Found ${itemsToUpdate.length} items to update.`);
  for (const item of itemsToUpdate) {
    console.log(`Fetching image for: ${item.query}`);
    const imgUrl = await fetchUnsplashImage(item.query);
    if (imgUrl) {
      console.log(`Found: ${imgUrl}`);
      const replacement = `image: '${imgUrl}?w=400&h=400&fit=crop'`;
      menuContent = menuContent.replace(item.fullMatch, replacement);
    } else {
      console.log(`Not found for: ${item.query}, using fallback.`);
      const fallback = `image: 'https://images.unsplash.com/photo-1414235077428-338988691282?w=400&h=400&fit=crop'`;
      menuContent = menuContent.replace(item.fullMatch, fallback);
    }
    // sleep a bit to avoid rate limiting
    await new Promise(r => setTimeout(r, 500));
  }
  
  fs.writeFileSync(menuPath, menuContent, 'utf8');
  console.log('Done updating menu.ts');
}

run();
