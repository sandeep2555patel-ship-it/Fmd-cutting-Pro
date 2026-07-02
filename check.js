import puppeteer from 'puppeteer';

(async () => {
  const browser = await puppeteer.launch({ args: ['--no-sandbox', '--disable-setuid-sandbox'] });
  const page = await browser.newPage();
  page.on('console', msg => console.log('PAGE LOG:', msg.text()));
  page.on('pageerror', error => console.log('PAGE ERROR:', error.message));
  page.on('requestfailed', request => {
    console.log('REQUEST FAILED:', request.url(), request.failure()?.errorText);
  });
  page.on('response', response => {
    if (!response.ok()) {
      console.log('RESPONSE NOT OK:', response.url(), response.status());
    }
  });
  await page.goto('https://ais-dev-rqrwua5xewnt4fnjkbgwrz-121032074657.asia-southeast1.run.app', {waitUntil: 'networkidle0'});
  const html = await page.evaluate(() => document.body.innerHTML);
  console.log("HTML:", html.substring(0, 500));
  await browser.close();
})();
