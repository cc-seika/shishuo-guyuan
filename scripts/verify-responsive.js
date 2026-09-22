const { chromium } = require("playwright");
const fs = require("node:fs");
const os = require("node:os");
const path = require("node:path");

const edgeCandidates = [
  process.env.PLAYWRIGHT_EXECUTABLE_PATH,
  "C:/Program Files (x86)/Microsoft/EdgeCore/Optimized/msedge.exe",
  "C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe",
].filter(Boolean);
const EDGE_PATH = edgeCandidates.find((candidate) => fs.existsSync(candidate));
const BASE_URL = process.env.PREVIEW_URL || "http://127.0.0.1:4173/web/?v=flow-17#culture";
const DESIGN_RATIO = 591 / 1280;
const pages = ["login", "home", "culture", "leisure", "family", "mine", "ai-guide-1", "ai-guide-2"];
const guidePages = new Set(["culture", "leisure", "family"]);
const sizes = [
  [375, 667, "iPhone SE"],
  [390, 844, "iPhone 12-14"],
  [393, 852, "iPhone 15"],
  [430, 932, "iPhone Pro Max"],
  [360, 740, "Android compact"],
  [360, 800, "Android common"],
  [412, 915, "Android modern"],
  [384, 854, "Android tall"],
];

async function main() {
  if (!EDGE_PATH) throw new Error("Microsoft Edge executable not found");
  const browser = await chromium.launch({ headless: true, executablePath: EDGE_PATH });
  const failures = [];

  for (const [width, height, label] of sizes) {
    const page = await browser.newPage({ viewport: { width, height } });
    const pageResults = [];

    for (const screen of pages) {
      await page.goto(`${BASE_URL.slice(0, BASE_URL.indexOf("#"))}#${screen}`, { waitUntil: "networkidle" });
      await page.waitForFunction(() => {
        const image = document.querySelector("#screen-image");
        return image && image.complete && image.naturalWidth === 591 && image.naturalHeight === 1280;
      });
      if (guidePages.has(screen)) {
        await page.evaluate(() => localStorage.removeItem("shishuo-favorite-routes"));
        await page.locator(`[data-screen-layer="${screen}"] .guide-favorite`).click();
        await page.waitForTimeout(180);
      }

      const result = await page.evaluate(({ expectedRatio, screen, isGuide }) => {
        const phone = document.querySelector(".phone").getBoundingClientRect();
        const layer = document.querySelector(`[data-screen-layer="${screen}"]`);
        const image = document.querySelector("#screen-image");
        const overflow = {
          x: document.documentElement.scrollWidth - innerWidth,
          y: document.documentElement.scrollHeight - innerHeight,
        };
        const baseResult = {
          screen,
          phone: { x: phone.x, y: phone.y, width: phone.width, height: phone.height },
          ratio: phone.width / phone.height,
          expectedRatio,
          overflow,
          imageLoaded: image.complete && image.naturalWidth === 591 && image.naturalHeight === 1280,
          layerVisible: !layer.hidden,
          visible: phone.x >= -0.5 && phone.y >= -0.5 && phone.right <= innerWidth + 0.5 && phone.bottom <= innerHeight + 0.5,
        };
        if (!isGuide) return baseResult;

        const favoriteElement = layer.querySelector(".guide-favorite");
        const favorite = favoriteElement.getBoundingClientRect();
        const star = favoriteElement.querySelector(".favorite-star").getBoundingClientRect();
      const expectedStar = {
        x: phone.x + (34 / 591) * phone.width,
        y: phone.y + (1199 / 1280) * phone.height,
        width: (21 / 591) * phone.width,
        height: (23 / 1280) * phone.height,
      };
      const actualStar = {
        x: star.x,
        y: star.y,
        width: star.width,
        height: star.height,
      };
      return {
        ...baseResult,
        expectedStar,
        actualStar,
        delta: {
          x: actualStar.x - expectedStar.x,
          y: actualStar.y - expectedStar.y,
          width: actualStar.width - expectedStar.width,
          height: actualStar.height - expectedStar.height,
        },
      };
      }, { expectedRatio: DESIGN_RATIO, screen, isGuide: guidePages.has(screen) });
      pageResults.push(result);
    }

    const pass = pageResults.every((result) => result.visible
      && result.imageLoaded
      && result.layerVisible
      && Math.abs(result.ratio - DESIGN_RATIO) < 0.001
      && result.overflow.x <= 0
      && result.overflow.y <= 0
      && (!result.delta || (
        Math.abs(result.delta.x) < 0.8
        && Math.abs(result.delta.y) < 0.8
        && Math.abs(result.delta.width) < 0.8
        && Math.abs(result.delta.height) < 0.8
      )));
    const details = pass
      ? pageResults.filter((result) => result.delta).map((result) => ({ screen: result.screen, delta: result.delta }))
      : pageResults;
    console.log(`${pass ? "PASS" : "FAIL"} ${label} ${width}x${height} screens=${pageResults.length}`, JSON.stringify(details));
    if (!pass) failures.push(label);
    await page.close();
  }

  const visual = await browser.newPage({ viewport: { width: 393, height: 852 }, deviceScaleFactor: 2 });
  await visual.goto(BASE_URL, { waitUntil: "networkidle" });
  await visual.evaluate(() => localStorage.removeItem("shishuo-favorite-routes"));
  await visual.reload({ waitUntil: "networkidle" });
  await visual.locator('[data-screen-layer="culture"] .guide-favorite').click();
  await visual.waitForTimeout(180);
  const screenshotPath = path.join(os.tmpdir(), "flow-17-iphone15-culture.png");
  await visual.screenshot({ path: screenshotPath, fullPage: true });
  console.log(`Screenshot: ${screenshotPath}`);
  await browser.close();

  if (failures.length) {
    throw new Error(`Responsive verification failed: ${failures.join(", ")}`);
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
