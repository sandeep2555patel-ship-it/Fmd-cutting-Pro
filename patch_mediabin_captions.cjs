const fs = require('fs');
let code = fs.readFileSync('src/components/MediaBin.tsx', 'utf8');

const OLD = `      const hindiTexts = ['नमस्ते', 'आज के वीडियो में', 'आपका स्वागत है', 'हम सीखेंगे', 'वीडियो एडिटिंग'];
      const englishTexts = ['Hello', 'In today\\'s video', 'Welcome back', 'We will learn', 'Video editing'];`;

const NEW = `      const hindiTexts = ['नमस्ते दोस्तों,', 'इस वीडियो में हम देखेंगे', 'कि कैसे हम आसानी से', 'शानदार वीडियो बना सकते हैं।', 'चलिए शुरू करते हैं!'];
      const englishTexts = ['Hey everyone,', 'in this quick tutorial', 'we are going to learn', 'how to create amazing edits.', 'Let\\'s get started!'];`;

code = code.replace(OLD, NEW);
fs.writeFileSync('src/components/MediaBin.tsx', code);
