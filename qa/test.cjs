const { chromium } = require(
  require("node:path").join(
    require("node:os").tmpdir(),
    "battery-panic-qa/node_modules/playwright",
  ),
);
const fs = require("node:fs/promises");
const assert = require("node:assert/strict");
const path = require("node:path");
const base = process.env.ARCADE_BASE_URL || "http://127.0.0.1:4173/battery-panic-game/";
const out = path.join(__dirname, "screenshots");
(async () => {
  await fs.mkdir(out, { recursive: true });
  const browser = await chromium.launch({ channel: "chrome", headless: true });
  const results = [];
  const errors = [];
  for (const spec of [
    { name: "desktop", width: 1440, height: 1000, touch: false },
    { name: "tablet", width: 820, height: 1180, touch: true },
    { name: "mobile", width: 390, height: 844, touch: true },
  ]) {
    const context = await browser.newContext({
      viewport: { width: spec.width, height: spec.height },
      hasTouch: spec.touch,
      isMobile: spec.touch,
      deviceScaleFactor: 1,
    });
    const page = await context.newPage();
    page.on("pageerror", (e) => errors.push(spec.name + ": " + e.message));
    page.on("console", (m) => {
      if (m.type() === "error") errors.push(spec.name + ": " + m.text());
    });
    page.on("response", (r) => {
      if (r.status() >= 400)
        errors.push(spec.name + ": HTTP " + r.status() + " " + r.url());
    });
    await page.addInitScript(() => {
      // Observe canvas geometry for clicking actual moving bubbles. No game source edits.
      const arc = CanvasRenderingContext2D.prototype.arc;
      CanvasRenderingContext2D.prototype.arc = function (x, y, r, ...rest) {
        if (this.canvas.id === "c" && r > 16) {
          window.__bubbleHits ??= [];
          window.__bubbleHits.push({ x, y, r });
          if (window.__bubbleHits.length > 80) window.__bubbleHits.shift();
        }
        return arc.call(this, x, y, r, ...rest);
      };
    });
    async function activate(locator) {
      if (spec.touch) await locator.tap();
      else await locator.click();
    }
    async function overflow(label) {
      assert.ok(
        await page.evaluate(
          () => document.documentElement.scrollWidth <= innerWidth,
        ),
        spec.name + " overflow " + label,
      );
    }
    await page.goto(base);
    await page.waitForTimeout(800);
    await overflow("hub");
    assert.equal(await page.locator(".play").count(), 4);
    await page.screenshot({
      path: path.join(out, "hub-" + spec.name + ".png"),
      fullPage: true,
    });
    const games = [
      ["Battery Panic", "battery_panic.html"],
      ["Pattern Matching", "pattern_matching.html"],
      ["SOAP", "soap.html"],
      ["Matching", "matching.html"],
    ];
    for (const [name, file] of games) {
      await activate(
        page.getByRole("link", { name: "Play " + name, exact: true }),
      );
      await page.waitForURL(base + file);
      await page.waitForTimeout(350);
      await overflow(name);
      assert.ok(await page.locator(".arcade-return").isVisible());
      if (name === "Battery Panic") {
        assert.match(
          await page.locator("#game").getAttribute("aria-label"),
          /Press A or Z/,
        );
        if (spec.touch) await page.locator('[data-control="a"]').tap();
        else await page.keyboard.press("z");
        await page.waitForTimeout(150);
        assert.match(
          await page.locator("#status").textContent(),
          /Game started/,
        );
        if (spec.touch) {
          await page.locator('[data-control="right"]').tap();
          await page.locator('[data-control="a"]').tap();
          await page.locator('[data-control="b"]').tap();
        } else {
          await page.keyboard.down("ArrowRight");
          await page.waitForTimeout(250);
          await page.keyboard.press("z");
          await page.keyboard.up("ArrowRight");
          await page.keyboard.press("x");
        }
        await activate(page.locator("#mute"));
        assert.equal(
          await page.locator("#mute").getAttribute("aria-pressed"),
          "true",
        );
        await activate(page.locator("#mute"));
        assert.equal(
          await page.locator("#mute").getAttribute("aria-pressed"),
          "false",
        );
      } else if (name === "Pattern Matching") {
        const first = await page
          .locator("#pattern .tile")
          .first()
          .textContent();
        const correct = page.locator(".choice").filter({ hasText: first });
        const incorrect = page
          .locator(".choice")
          .filter({ hasNotText: first })
          .first();
        await activate(incorrect);
        assert.equal(await page.locator("#score").textContent(), "0");
        await activate(correct);
        assert.equal(await page.locator("#score").textContent(), "1");
        await page.waitForTimeout(1250);
        assert.equal(await page.locator(".choice").count(), 3);
      } else if (name === "SOAP") {
        for (
          let attempt = 0;
          attempt < 20 && (await page.locator("#score").textContent()) === "0";
          attempt++
        ) {
          const bubble = await page.evaluate(() =>
            window.__bubbleHits
              ?.filter(
                (b) =>
                  b.y > b.r + 110 &&
                  b.y < innerHeight - b.r &&
                  b.x > b.r &&
                  b.x < innerWidth - b.r,
              )
              .at(-1),
          );
          if (bubble) {
            if (spec.touch) await page.touchscreen.tap(bubble.x, bubble.y);
            else await page.mouse.click(bubble.x, bubble.y);
          }
          await page.waitForTimeout(80);
        }
        assert.ok(
          Number(await page.locator("#score").textContent()) > 0,
          "Bubble pop increments score",
        );
        assert.ok(
          await page
            .locator("#hint")
            .evaluate((el) => el.classList.contains("hide")),
        );
      } else {
        const emojis = await page
          .locator(".card")
          .evaluateAll((els) => els.map((e) => e.dataset.emoji));
        const wrong = emojis.findIndex((e) => e !== emojis[0]);
        await activate(page.locator(".card").nth(0));
        await activate(page.locator(".card").nth(wrong));
        await page.waitForTimeout(1050);
        assert.equal(await page.locator(".card.flipped").count(), 0);
        for (const emoji of new Set(emojis)) {
          const positions = emojis
            .map((e, i) => (e === emoji ? i : -1))
            .filter((i) => i >= 0);
          for (const i of positions)
            await activate(page.locator(".card").nth(i));
          await page.waitForTimeout(370);
        }
        assert.equal(await page.locator("#pairs").textContent(), "6");
        await page.waitForTimeout(500);
        assert.ok(await page.locator("#win").isVisible());
        await page.screenshot({
          path: path.join(out, "matching-win-" + spec.name + ".png"),
          fullPage: true,
        });
        // Return navigation must remain above win overlays.
        assert.ok(
          await page.locator(".arcade-return").evaluate((el) => {
            const r = el.getBoundingClientRect();
            return (
              document.elementFromPoint(
                r.x + r.width / 2,
                r.y + r.height / 2,
              ) === el
            );
          }),
        );
        await activate(page.locator("#replay"));
        assert.equal(await page.locator("#pairs").textContent(), "0");
        assert.equal(await page.locator(".card").count(), 12);
      }
      await page.waitForTimeout(650);
      await page.screenshot({
        path: path.join(
          out,
          file.replace(".html", "") + "-" + spec.name + ".png",
        ),
        fullPage: true,
      });
      await activate(page.getByRole("link", { name: "Back to Arcade" }));
      await page.waitForURL(base + "index.html");
      await page.goBack();
      await page.waitForURL(base + file);
      await page.goForward();
      await page.waitForURL(base + "index.html");
      results.push({
        viewport: spec.name,
        game: name,
        launch: true,
        gameplay: true,
        returnNavigation: true,
        browserHistory: true,
        noHorizontalOverflow: true,
      });
    }
    await context.close();
  }
  // Narrow mobile and landscape layout checks.
  const context = await browser.newContext();
  const page = await context.newPage();
  for (const viewport of [
    { width: 320, height: 568 },
    { width: 844, height: 390 },
  ]) {
    await page.setViewportSize(viewport);
    for (const file of [
      "index.html",
      "battery_panic.html",
      "pattern_matching.html",
      "soap.html",
      "matching.html",
    ]) {
      await page.goto(base + file);
      assert.ok(
        await page.evaluate(
          () => document.documentElement.scrollWidth <= innerWidth,
        ),
        "Overflow " + file + " " + viewport.width,
      );
    }
  }
  await context.close();
  await browser.close();
  assert.deepEqual(errors, []);
  await fs.writeFile(
    path.join(__dirname, "results.json"),
    JSON.stringify(
      {
        browser: "Chrome (Playwright)",
        base,
        results,
        additionalViewports: ["320x568", "844x390"],
        errors,
      },
      null,
      2,
    ),
  );
  console.log(
    JSON.stringify({ tests: results.length, errors, results }, null, 2),
  );
})().catch((e) => {
  console.error(e);
  process.exitCode = 1;
});
