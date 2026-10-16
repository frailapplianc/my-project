const { JSDOM } = require('jsdom');
const fs = require('fs');
const file = process.argv[2] || 'itog.html';
const html = fs.readFileSync(file, 'utf8');
const errors = [];
const dom = new JSDOM(html, {
  runScripts: 'dangerously',
  pretendToBeVisual: true,
  url: 'http://localhost/',
  beforeParse(window) {
    window.addEventListener('error', e => errors.push('ERROR: ' + (e.error ? e.error.stack : e.message)));
    const origWarn = console.warn;
  }
});
const w = dom.window;
setTimeout(() => {
  console.log('=== ERRORS ===');
  console.log(errors.length ? errors.join('\n---\n') : '(none)');
  console.log('=== BODY SNIPPET ===');
  console.log(w.document.body.innerHTML.slice(0, 1500));
  process.exit(0);
}, 3000);
