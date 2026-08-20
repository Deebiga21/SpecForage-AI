import puppeteer from 'puppeteer';

(async () => {
  const browser = await puppeteer.launch({ executablePath: 'C:\\\\Program Files\\\\Google\\\\Chrome\\\\Application\\\\chrome.exe', headless: 'new' });
  const page = await browser.newPage();
  
  page.on('console', msg => console.log('PAGE LOG:', msg.text()));
  page.on('pageerror', error => console.log('PAGE ERROR:', error.message));
  page.on('requestfailed', request => console.log('REQUEST FAILED:', request.url(), request.failure().errorText));
  page.on('response', async response => {
    if (response.url().includes('/api/')) {
        console.log('API RESPONSE:', response.url(), await response.text());
    }
  });

  console.log("Navigating to app...");
  await page.goto('http://localhost:5173/app/dashboard', { waitUntil: 'networkidle0' });
  
  console.log("Waiting 3s...");
  await new Promise(r => setTimeout(r, 3000));
  await page.screenshot({ path: 'screenshot.png' });
  console.log("Screenshot taken.");
  
  await browser.close();
})();
