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
};

const destDir = path.join(__dirname, 'assets', 'images');

try {
  for (const [filename, srcPath] of Object.entries(avatarMap)) {
    if (fs.existsSync(srcPath)) {
      const destPath = path.join(destDir, filename);
      fs.copyFileSync(srcPath, destPath);
      console.log(`[Metro Config] Copied ${filename} to assets/images/`);
    }
  }
} catch (err) {
  console.error('[Metro Config] Error copying avatars:', err);
}

const config = getDefaultConfig(__dirname);
module.exports = config;
