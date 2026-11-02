import { expect, test, type Page } from "@playwright/test";
import { frames, money, parts, prices, repairSymptoms } from "../../lib/site-data";

// What a customer does on the site, at every screen size. Run after `pnpm build`.

const errorsOn = (page: Page) => {
  const errors: string[] = [];
  page.on("pageerror", (e) => errors.push(e.message));
  page.on("console", (m) => { if (m.type() === "error") errors.push(m.text()); });
  return errors;
};

const noSideScroll = async (page: Page) =>
  expect(await page.evaluate(() => document.documentElement.scrollWidth - innerWidth)).toBeLessThanOrEqual(0);

// Honesty: a made-up company has no reviews, ratings, licences or guarantees.
const banned = /\b(reviews?|testimonials?|stars?|5-star|licensed|licence|license #|certified|guarantee[ds]?|award|happy customers|years in business)\b/i;

for (const path of ["/", "/commercial"]) {
  test(`${path} loads clean: no errors, no side scroll, demo label, honest copy`, async ({ page }) => {
    const errors = errorsOn(page);
    await page.goto(path);
    await expect(page.locator("h1")).toHaveCount(1);
    await expect(page.getByText("Demo concept · placeholder brand").first()).toBeVisible();
    await noSideScroll(page);
    const text = await page.locator("body").innerText();
    expect(text).not.toMatch(banned);
    expect(text).not.toMatch(/\d{2,5} [A-Z][a-z]+ (Street|St|Avenue|Ave|Road|Rd|Blvd)\b/); // no street address
    await page.waitForTimeout(500);
    expect(errors).toEqual([]);
  });

  test(`${path} footer keeps the credit and Contact link`, async ({ page }) => {
    await page.goto(path);
    const footer = page.locator("footer");
    await expect(footer.getByText("Site design & build by Elijah")).toBeVisible();
    const contact = footer.getByRole("link", { name: "Contact" });
    await expect(contact).toHaveAttribute("href", "https://www.linkedin.com/in/elijah-johnson-data-ai/");
    await expect(contact).toHaveAttribute("target", "_blank");
    await expect(contact).toHaveAttribute("rel", /noopener/);
  });
}

test("hero says AC and its buttons work above the film layers", async ({ page }) => {
  await page.goto("/");
  await expect(page.locator("h1")).toHaveText("Cool. Finally.");
  const call = page.locator("section.scene").getByRole("link", { name: /Call \(305\) 555-0142/ });
  await expect(call).toHaveAttribute("href", /^tel:/);
  // The top element at the button's centre must be the button itself (not a canvas or overlay).
  const box = (await call.boundingBox())!;
  const hit = await page.evaluate(([x, y]) => document.elementFromPoint(x, y)?.closest("a")?.getAttribute("href"), [box.x + box.width / 2, box.y + box.height / 2]);
  expect(hit).toMatch(/^tel:/);
});

test("every part, checked: the unit comes apart with scroll and all five parts are named", async ({ page, request }) => {
  const { dir, phoneDir, count } = frames.unit;
  for (const d of [dir, phoneDir]) {
    for (const n of [1, count]) expect((await request.get(`${d}/frame-${String(n).padStart(4, "0")}.webp`)).ok()).toBe(true);
  }
  await page.goto("/");
  const scene = page.locator("section[aria-label^='An outdoor air-conditioning unit']");
  await scene.scrollIntoViewIfNeeded();
  // scroll to the end of the pinned scene (220vh)
  await scene.evaluate((el) => scrollTo(0, el.getBoundingClientRect().top + scrollY + innerHeight * 2.2));
  await page.waitForTimeout(1200);
  // labels are pinned on the parts and fade in once it has come apart
  for (const p of parts) await expect(scene.getByText(p.name, { exact: true }).filter({ visible: true })).toHaveCount(1);
  const shown = await scene.locator("li.pin").evaluateAll((els) => els.map((e) => getComputedStyle(e).opacity));
  expect(shown).toEqual(parts.map(() => "1"));
});

test("moving between pages keeps working after scrolling the films", async ({ page }) => {
  const errors = errorsOn(page);
  await page.goto("/");
  await page.mouse.wheel(0, 600);
  await page.waitForTimeout(800);
  await page.goto("/"); // fresh top, then use the site's own links
  await page.mouse.wheel(0, 300);
  await page.waitForTimeout(800);
  const menu = page.getByRole("button", { name: /menu/i });
  if (await menu.isVisible()) await menu.click();
  await page.getByRole("link", { name: "Commercial", exact: true }).first().click();
  await expect(page.locator("h1")).toHaveText("Built for the whole building.");
  await page.goBack();
  await expect(page.locator("h1")).toHaveText("Cool. Finally.");
  expect(errors).toEqual([]);
});

test("repair tool shows a picture of the likely part for every symptom", async ({ page }) => {
  await page.goto("/");
  const group = page.getByRole("group", { name: "What is it doing?" });
  await group.scrollIntoViewIfNeeded();
  for (const s of repairSymptoms) {
    await group.getByRole("button", { name: s.label, exact: true }).click();
    const img = page.locator("#tool-panel").getByRole("img", { name: `Likely part: ${s.likely}` });
    await expect(img).toBeVisible();
    await expect.poll(() => img.evaluate((el: HTMLImageElement) => el.naturalWidth)).toBeGreaterThan(0);
  }
});

test("feel the difference: the slider cools the room by keyboard", async ({ page }) => {
  await page.goto("/");
  const slider = page.getByRole("slider", { name: "Drag to cool it down" });
  await slider.scrollIntoViewIfNeeded();
  await expect(slider).toHaveAttribute("aria-valuetext", "91°F");
  await slider.focus();
  await page.keyboard.press("End");
  await expect(slider).toHaveAttribute("aria-valuetext", "72°F");
});

test("feel the difference: dragging across the middle of the picture cools the room", async ({ page }) => {
  await page.goto("/");
  const slider = page.getByRole("slider", { name: "Drag to cool it down" });
  const frame = page.locator("#feel .frame");
  await frame.scrollIntoViewIfNeeded();
  const box = (await frame.boundingBox())!;
  const y = box.y + box.height / 2; // where the handle sits, not the top edge
  await page.mouse.move(box.x + box.width * 0.1, y);
  await page.mouse.down();
  for (let i = 2; i <= 10; i++) await page.mouse.move(box.x + box.width * (i / 10), y);
  await page.mouse.up();
  const temp = parseInt((await slider.getAttribute("aria-valuetext")) ?? "91", 10);
  expect(temp).toBeLessThanOrEqual(73);
});

test("repair tool: every symptom shows exactly its own fixes and the prices from the data file", async ({ page }) => {
  await page.goto("/");
  const group = page.getByRole("group", { name: "What is it doing?" });
  await group.scrollIntoViewIfNeeded();
  const panel = page.locator("#tool-panel");
  for (const s of repairSymptoms) {
    await group.getByRole("button", { name: s.label, exact: true }).click();
    await expect(group.getByRole("button", { name: s.label, exact: true })).toHaveAttribute("aria-pressed", "true");
    await expect(panel.getByText(`Most likely: ${s.likely}`)).toBeVisible();
    const expected = [
      { label: "Diagnostic visit", price: money(prices.diagnostic) },
      ...s.fixes.map((f) => ({ label: f.label, price: money(f.range) })),
      ...(s.big ? [{ label: s.big.label, price: money(s.big.range) }] : []),
    ];
    // Each row: a bold label and a price whose screen-reader text is the exact range (the visible digits roll).
    const rows = panel.locator("div > p.font-medium:first-child");
    await expect(rows).toHaveText(expected.map((e) => e.label));
    const shown = await panel.locator(".num > .sr-only-text").allTextContents();
    expect(shown).toEqual(expected.map((e) => e.price));
    // After the roll animation the visible numbers match too.
    await expect(panel.locator(".num > [aria-hidden]").last()).toHaveText(expected[expected.length - 1].price.replace(/\s/g, ""), { timeout: 3000 });
  }
});

test("repair tool: the compressor only appears for warm air and noise", async ({ page }) => {
  await page.goto("/");
  const group = page.getByRole("group", { name: "What is it doing?" });
  await group.scrollIntoViewIfNeeded();
  for (const s of repairSymptoms) {
    await group.getByRole("button", { name: s.label, exact: true }).click();
    const hasCompressor = await page.locator("#tool-panel").getByText("If it is the compressor").count();
    expect(hasCompressor, s.label).toBe(["warm", "loud"].includes(s.id) ? 1 : 0);
  }
});

test("repair, replace or install: tabs fit on one line and each gives an answer", async ({ page }) => {
  await page.goto("/");
  const tabs = page.getByRole("tab");
  await tabs.first().scrollIntoViewIfNeeded();
  const tops = await tabs.evaluateAll((els) => els.map((e) => Math.round(e.getBoundingClientRect().top)));
  expect(new Set(tops).size).toBe(1);
  const heights = await tabs.evaluateAll((els) => els.map((e) => e.getBoundingClientRect().height));
  expect(Math.max(...heights)).toBeLessThan(60); // a wrapped label doubles the height

  const panel = page.locator("#tool-panel");
  await expect(panel).toContainText("$89–$150"); // Repair: diagnostic visit
  await page.getByRole("tab", { name: "Replace" }).click();
  await expect(panel).toContainText(/Repair it|Replacing is likely smarter/);
  await expect(panel).toContainText("rule of thumb");
  await page.getByRole("tab", { name: "Install" }).click();
  await expect(panel).toContainText("Mini-split");
});

test("size picker updates the room and the price", async ({ page }) => {
  await page.goto("/");
  await page.locator("#size").scrollIntoViewIfNeeded();
  await page.getByRole("button", { name: "12k" }).click();
  await expect(page.locator("#size")).toContainText("12,000 BTU");
  await page.getByRole("button", { name: "Whole home" }).click();
  await expect(page.locator("#size")).toContainText("3 ton");
});

test("plans: the Comfort Plan button fills the booking form", async ({ page }) => {
  await page.goto("/");
  await expect(page.locator("#plans")).toContainText("$219");
  await page.getByRole("link", { name: "Join the Comfort Plan" }).click();
  await expect(page.locator("#book-need")).toHaveValue("Comfort Plan");
});

test("booking form checks the fields, then says plainly that nothing was sent", async ({ page }) => {
  await page.goto("/#book");
  const submit = page.getByRole("button", { name: "Request a visit" });
  await submit.click();
  await expect(page.locator("#book-name-err")).toBeVisible();
  await page.fill("#book-name", "Test Customer");
  await page.fill("#book-phone", "305 555 0100");
  await page.fill("#book-zip", "33101");
  await page.selectOption("#book-need", "Repair");
  await submit.click();
  await expect(page.getByRole("status")).toContainText("no booking was made and nothing was sent");
});

test("commercial: four services, no price for contracts, survey form is a demo", async ({ page }) => {
  await page.goto("/commercial");
  await expect(page.locator("h1")).toContainText("whole building");
  await expect(page.getByText("Quoted per site")).toBeVisible();
  for (const s of ["Ducted system installs", "Duct repair and sealing", "Rooftop units", "Vents and airflow balancing"]) {
    await expect(page.getByText(s, { exact: false }).first()).toBeVisible();
  }
  await page.getByRole("button", { name: "Request a site survey" }).click();
  await expect(page.locator("[aria-invalid=true]").first()).toBeVisible();
});

test("reduced motion: hero rests cool, no heat shimmer", async ({ browser }) => {
  const ctx = await browser.newContext({ reducedMotion: "reduce" });
  const page = await ctx.newPage();
  await page.goto("/");
  await expect(page.locator("section.scene").first()).toContainText("Cool. Finally.");
  expect(await page.locator("h1").evaluate((h) => getComputedStyle(h).filter)).toBe("none");
  await ctx.close();
});

test("search basics: titles, descriptions, sitemap and robots", async ({ page, request }) => {
  for (const path of ["/", "/commercial"]) {
    await page.goto(path);
    expect((await page.title()).length).toBeGreaterThan(10);
    await expect(page.locator('meta[name="description"]')).toHaveAttribute("content", /.{40,}/);
    await expect(page.locator('meta[property="og:image"]')).toHaveCount(1);
  }
  expect((await request.get("/sitemap.xml")).ok()).toBe(true);
  expect(await (await request.get("/robots.txt")).text()).toContain("Sitemap");
});
