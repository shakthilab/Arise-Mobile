const { getDefaultConfig } = require('expo/metro-config');
const fs = require('fs');
const path = require('path');

// Copy AI-designed generated avatars to assets/images
const avatarMap = {
  'naruto.jpg': 'C:/Users/HP/.gemini/antigravity-ide/brain/87b29d3b-410f-4250-8c00-0c22642f24b1/avatar_naruto_1786783119265.jpg',
  'luffy.jpg': 'C:/Users/HP/.gemini/antigravity-ide/brain/87b29d3b-410f-4250-8c00-0c22642f24b1/avatar_luffy_1786783159479.jpg',
  'gojo.jpg': 'C:/Users/HP/.gemini/antigravity-ide/brain/87b29d3b-410f-4250-8c00-0c22642f24b1/avatar_gojo_1786783250047.jpg',
  'itachi.jpg': 'C:/Users/HP/.gemini/antigravity-ide/brain/87b29d3b-410f-4250-8c00-0c22642f24b1/avatar_itachi_1786783443328.jpg',
  'goku.jpg': 'C:/Users/HP/.gemini/antigravity-ide/brain/87b29d3b-410f-4250-8c00-0c22642f24b1/avatar_goku_1786783621404.jpg',
  'jinwoo.jpg': 'C:/Users/HP/.gemini/antigravity-ide/brain/87b29d3b-410f-4250-8c00-0c22642f24b1/avatar_jinwoo_1786783657459.jpg',
  'altar_sanctuary_bg.jpg': 'C:/Users/HP/.gemini/antigravity-ide/brain/c0cc9f48-47f6-4618-ba60-3ea6ca1a0fc9/altar_sanctuary_bg_1788284745434.jpg',
  'dragon_egg.jpg': [
    'C:/Users/HP/.gemini/antigravity-ide/brain/c0cc9f48-47f6-4618-ba60-3ea6ca1a0fc9/dragon_egg_1788285794765.jpg',
    'C:\\Users\\HP\\.gemini\\antigravity-ide\\brain\\c0cc9f48-47f6-4618-ba60-3ea6ca1a0fc9\\dragon_egg_1788285794765.jpg',
  ],
};

const destDir = path.join(__dirname, 'assets', 'images');

try {
  for (const [filename, src] of Object.entries(avatarMap)) {
    const candidates = Array.isArray(src) ? src : [src];
    for (const srcPath of candidates) {
      if (fs.existsSync(srcPath)) {
        const destPath = path.join(destDir, filename);
        fs.copyFileSync(srcPath, destPath);
        console.log(`[Metro Config] Copied ${filename} to assets/images/`);
        break;
      }
    }
  }
} catch (err) {
  console.error('[Metro Config] Error copying avatars:', err);
}

const config = getDefaultConfig(__dirname);
module.exports = config;
