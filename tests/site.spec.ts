import { test, expect, type Page } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

const pages = ['', 'en/', 'projetos/cobratec-360/', 'projetos/api-dm/', 'en/projects/eric-mac/', 'projetos/cobratec-negocia/'];
const viewports = [
  { width: 375, height: 812 },
  { width: 768, height: 1024 },
  { width: 1440, height: 900 },
];

async function noHorizontalScroll(page: Page) {
  const { sw, cw } = await page.evaluate(() => ({ sw: document.documentElement.scrollWidth, cw: document.documentElement.clientWidth }));
  expect(sw, 'a página não pode rolar na horizontal').toBeLessThanOrEqual(cw);
}

for (const scheme of ['dark', 'light'] as const) {
  test.describe(`acessibilidade · tema ${scheme}`, () => {
    test.use({ colorScheme: scheme, reducedMotion: 'reduce' });
    for (const path of pages) {
      test(`axe sem violações em /${path}`, async ({ page }) => {
        await page.goto(path);
        const r = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa']).analyze();
        expect(r.violations.map((v) => `${v.id}: ${v.nodes.length} — ${v.nodes[0]?.target}`)).toEqual([]);
      });
    }
  });
}

test.describe('layout responsivo', () => {
  test.use({ reducedMotion: 'reduce' });
  for (const vp of viewports) {
    test(`sem rolagem horizontal em ${vp.width}px`, async ({ page }) => {
      await page.setViewportSize(vp);
      for (const path of ['', 'en/', 'projetos/cobratec-360/']) {
        await page.goto(path);
        await noHorizontalScroll(page);
      }
    });
  }
});

test('movimento reduzido: GSAP não é baixado e tudo fica visível', async ({ browser }) => {
  const ctx = await browser.newContext({ reducedMotion: 'reduce', viewport: { width: 1440, height: 900 } });
  const page = await ctx.newPage();
  const scripts: string[] = [];
  page.on('request', (r) => r.resourceType() === 'script' && scripts.push(r.url()));
  await page.goto('/portflio/');
  await page.waitForTimeout(1500);
  expect(scripts.some((s) => s.includes('motion'))).toBe(false);
  await expect(page.locator('[data-reveal]').first()).toBeVisible();
  await ctx.close();
});

test('teclado: focar um painel fixado rola a página até ele', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto('');
  await page.mouse.move(200, 200); // o módulo de movimento carrega na 1ª interação
  await page.waitForFunction(() => document.querySelector('.pro.is-pinned'));
  const cta = page.locator('[data-pro-panel] a').nth(3);
  await cta.focus();
  await page.waitForTimeout(400);
  const box = await cta.boundingBox();
  expect(box).not.toBeNull();
  expect(box!.x).toBeGreaterThanOrEqual(0);
  expect(box!.x + box!.width).toBeLessThanOrEqual(1440);
  expect(box!.y).toBeGreaterThanOrEqual(0);
  expect(box!.y + box!.height).toBeLessThanOrEqual(900);
});

test('lightbox: abre, fecha com Esc e devolve o foco', async ({ page }) => {
  await page.goto('projetos/cobratec-360/');
  const opener = page.locator('[data-enlarge]').first();
  await opener.click();
  await expect(page.locator('[data-lightbox]')).toBeVisible();
  await page.keyboard.press('Escape');
  await expect(page.locator('[data-lightbox]')).toBeHidden();
  await expect(opener).toBeFocused();
});

test('troca de idioma leva à mesma página no outro idioma', async ({ page }) => {
  await page.goto('projetos/api-dm/');
  await page.getByRole('link', { name: 'Read in English' }).click();
  await expect(page).toHaveURL(/\/portflio\/en\/projects\/api-dm\/$/);
  await expect(page.locator('html')).toHaveAttribute('lang', 'en');
});
