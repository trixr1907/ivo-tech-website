import { test, expect } from '@playwright/test';

test.describe('Browser Compatibility Tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:3000');
  });

  test('Homepage loads correctly', async ({ page }) => {
    const title = await page.title();
    expect(title).toBeTruthy();
    
    // Check main layout elements
    await expect(page.locator('header')).toBeVisible();
    await expect(page.locator('main')).toBeVisible();
    await expect(page.locator('footer')).toBeVisible();
  });

  test('Portfolio page loads and filters work', async ({ page }) => {
    await page.goto('http://localhost:3000/portfolio');
    
    // Check category filters
    const filters = page.locator('.filter-buttons button');
    const count = await filters.count();
    expect(count).toBeGreaterThan(0);
    
    // Test filter functionality
    await filters.nth(1).click();
    await expect(page.locator('.portfolio-items')).toBeVisible();
  });

  test('Responsive design breakpoints', async ({ page }) => {
    // Test mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    await expect(page.locator('header')).toBeVisible();
    
    // Test tablet viewport
    await page.setViewportSize({ width: 768, height: 1024 });
    await expect(page.locator('header')).toBeVisible();
    
    // Test desktop viewport
    await page.setViewportSize({ width: 1440, height: 900 });
    await expect(page.locator('header')).toBeVisible();
  });

  test('Interactive elements work', async ({ page }) => {
    // Test navigation menu
    const nav = page.locator('nav');
    await expect(nav).toBeVisible();
    
    // Test buttons and links
    const buttons = page.locator('button');
    const count = await buttons.count();
    expect(count).toBeGreaterThan(0);
    
    // Test hover states
    await buttons.first().hover();
  });
});
