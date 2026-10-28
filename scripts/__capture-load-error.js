// 一次性：捕获页面加载错误（用后即删）。
const fs = require('fs');
const path = require('path');
const puppeteer = require('puppeteer-core');
function findBrowser() {
  const candidates = [process.env.ACTA_BROWSER, '/Applications/Microsoft Edge.app/Contents/MacOS/Microsoft Edge', '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'].filter(Boolean);
  const executable = candidates.find(candidate => fs.existsSync(candidate));
  if (!executable) throw new Error('No compatible browser found.');
  return executable;
}
async function main() {
  const { createServer } = await import('vite');
  const server = await createServer({ root: path.join(__dirname, '..'), logLevel: 'error', server: { port: 0, strictPort: false } });
  await server.listen();
  const browser = await puppeteer.launch({ executablePath: findBrowser(), headless: 'new', pipe: true, timeout: 60000, args: ['--no-sandbox'] });
  const page = await browser.newPage();
  page.on('pageerror', error => console.log('PAGEERROR ' + String(error && error.stack || error).slice(0, 400)));
  page.on('console', msg => { if (msg.type() === 'error') console.log('CONSOLE ' + msg.text().slice(0, 300)); });
  await page.goto(`http://localhost:${server.config.server.port}/`, { waitUntil: 'domcontentloaded' });
  await new Promise(resolve => setTimeout(resolve, 4000));
  const state = await page.evaluate(() => ({
    hasUiSettings: typeof uiSettings !== 'undefined',
    hasApplyTheme: typeof applyTheme !== 'undefined',
    hasActiveBoard: typeof activeBoard !== 'undefined'
  }));
  console.log('STATE ' + JSON.stringify(state));
  await browser.close();
  await server.close();
}
main().catch(error => { console.error(error); process.exit(1); });
