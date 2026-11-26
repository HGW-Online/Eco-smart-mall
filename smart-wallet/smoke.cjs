// يفتح النسخة المبنية في متصفح حقيقي ويفشل عند أي خطأ غير معالج أو صفحة فارغة.
const { chromium } = require('playwright');
(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  const errors = [];
  page.on('pageerror', (e) => errors.push(e.message));
  page.on('console', (m) => m.type() === 'error' && console.log('console:', m.text().slice(0, 300)));
  await page.goto(process.argv[2]);
  await page.waitForTimeout(8000);
  const text = await page.innerText('body');
  console.log(text);
  await browser.close();
  if (errors.length || !text.includes('HGW Smart Wallet')) {
    console.log('::error::' + (errors.join(' | ') || 'empty page').slice(0, 500));
    process.exit(1);
  }
  console.log('::notice::smoke ok: ' + text.replace(/\s+/g, ' ').slice(0, 300));
})();
