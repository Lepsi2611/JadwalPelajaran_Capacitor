// Menyalin file web ke folder www/ yang dipakai Capacitor (webDir).
const fs = require('fs'), path = require('path');
const root = path.join(__dirname, '..'), out = path.join(root, 'www');
fs.rmSync(out, { recursive: true, force: true });
fs.mkdirSync(out, { recursive: true });
['index.html', 'css', 'js', 'data', 'assets'].forEach(p =>
  fs.cpSync(path.join(root, p), path.join(out, p), { recursive: true }));
console.log('Web assets disalin ke www/');
