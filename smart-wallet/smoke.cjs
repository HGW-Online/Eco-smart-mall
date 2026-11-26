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
  const button = page.getByRole('button', { name: 'تسجيل الدخول' });
  if (await button.count()) {
    await button.click();
    await page.waitForTimeout(6000);
    const dialog = (await page.innerText('body')).replace(text, '').replace(/\s+/g, ' ').trim();
    console.log('::notice title=login dialog::' + (dialog.slice(0, 600) || 'nothing appeared'));
  } else {
    errors.push('login button did not appear');
  }
  await browser.close();
  if (errors.length || !text.includes('HGW Smart Wallet')) {
    console.log('::error::' + (errors.join(' | ') || 'empty page').slice(0, 500));
    process.exit(1);
  }
  console.log('::notice::smoke ok: ' + text.replace(/\s+/g, ' ').slice(0, 300));
})();
