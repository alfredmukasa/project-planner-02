import { expect, test, type Page } from '@playwright/test';

const routes = [
  '/',
  '/how-it-works/',
  '/features/',
  '/architecture/',
  '/agents/',
  '/pricing/',
  '/documentation/',
  '/documentation/getting-started/',
  '/documentation/identity/',
  '/documentation/workspace/',
  '/documentation/architecture/',
  '/documentation/agents/',
  '/documentation/development/',
  '/documentation/export/',
  '/documentation/keyboard/',
  '/documentation/changelog/',
  '/download/',
  '/support/',
  '/about/',
  '/security/',
  '/privacy/',
  '/terms/',
  '/login/',
  '/register/',
  '/forgot-password/',
];

async function collectConsoleErrors(page: Page): Promise<string[]> {
  const errors: string[] = [];
  page.on('pageerror', (err) => errors.push(err.message));
  page.on('console', (msg) => {
    if (msg.type() === 'error') errors.push(msg.text());
  });
  return errors;
}

test.describe('public website', () => {
  for (const route of routes) {
    test(`renders ${route}`, async ({ page }) => {
      const errors = await collectConsoleErrors(page);
      const response = await page.goto(route, { waitUntil: 'domcontentloaded' });
      expect(response?.ok(), `${route} should return 2xx`).toBeTruthy();
      await expect(page.locator('h1')).toBeVisible();
      await expect(page.getByRole('banner')).toBeVisible();
      await expect(page.getByRole('contentinfo')).toBeVisible();
      expect(errors, `console errors on ${route}`).toEqual([]);
    });
  }

  test('home shows labelled product previews', async ({ page }) => {
    await page.goto('/');
    await expect(page.getByTestId('preview-label').first()).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Plan before you build.' })).toBeVisible();
    await expect(page.getByTestId('feedback-button')).toBeVisible();
  });

  test('pricing lists four plans and disables checkout', async ({ page }) => {
    await page.goto('/pricing/');
    await expect(page.getByTestId('plan-free')).toBeVisible();
    await expect(page.getByTestId('plan-builder')).toContainText('$5');
    await expect(page.getByTestId('plan-pro')).toContainText('$15');
    await expect(page.getByTestId('plan-studio')).toContainText('$20');
    await expect(page.getByRole('button', { name: /launch/i }).first()).toBeDisabled();
  });

  test('download does not offer an installer', async ({ page }) => {
    await page.goto('/download/');
    const button = page.getByRole('button', { name: /coming soon/i });
    await expect(button).toBeDisabled();
    await expect(page.getByTestId('download-card')).toContainText('Not yet published');
  });

  test('login preview does not authenticate', async ({ page }) => {
    await page.goto('/login/');
    await page.getByRole('textbox', { name: 'Email' }).fill('preview@example.com');
    await page.getByLabel('Password').fill('not-a-real-password');
    await page.getByRole('button', { name: 'Sign in' }).click();
    await expect(page.getByTestId('auth-preview-notice')).toContainText('Accounts are not available yet');
  });

  test('feedback form is preview-only', async ({ page }) => {
    await page.goto('/support/#feedback');
    await page.getByRole('textbox', { name: 'Name' }).fill('Ada');
    await page.getByRole('textbox', { name: 'Email' }).fill('ada@example.com');
    await page.getByRole('textbox', { name: 'Message' }).fill('The architecture preview is clear.');
    await page.getByRole('button', { name: 'Submit feedback' }).click();
    await expect(page.getByTestId('feedback-preview-notice')).toBeVisible();
  });

  test('theme toggle switches light and midnight', async ({ page }) => {
    await page.goto('/');
    const html = page.locator('html');
    const before = await html.getAttribute('data-theme');
    await page.getByTestId('theme-toggle').click();
    const after = await html.getAttribute('data-theme');
    expect(after).not.toBe(before);
    expect(after === 'light' || after === 'dark').toBeTruthy();
    await page.getByTestId('theme-toggle').click();
    await expect(html).toHaveAttribute('data-theme', before ?? 'light');
  });

  test('mobile navigation opens', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto('/');
    await page.getByTestId('mobile-menu-button').click();
    await expect(page.getByRole('dialog', { name: 'Site menu' })).toBeVisible();
    await page.getByRole('dialog', { name: 'Site menu' }).getByRole('link', { name: 'Pricing' }).click();
    await expect(page).toHaveURL(/\/pricing\//);
  });
});
