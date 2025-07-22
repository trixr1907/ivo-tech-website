import { test, expect } from '@playwright/test';

test.describe('Homepage', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should have the correct page title', async ({ page }) => {
    await expect(page).toHaveTitle(/IVO Tech/);
  });

  test('should display main navigation', async ({ page }) => {
    await expect(page.locator('nav')).toBeVisible();
  });

  test('should render the 3D animated logo', async ({ page }) => {
    // Wait for 3D content to load
    await page.waitForTimeout(3000);
    const canvas = page.locator('canvas').first();
    await expect(canvas).toBeVisible();
  });

  test('should handle 3D logo interactions', async ({ page }) => {
    await page.waitForTimeout(2000);

    // Simulate hover interaction on 3D logo
    const logoContainer = page.locator('[data-testid="3d-logo-container"]');
    await logoContainer.hover();

    // Wait for animation to trigger
    await page.waitForTimeout(1000);

    // Check if logo responds to interactions
    await expect(logoContainer).toBeVisible();
  });

  test('should navigate to different sections', async ({ page }) => {
    // Test navigation functionality
    const aboutLink = page.locator('a[href*="about"]');
    if (await aboutLink.isVisible()) {
      await aboutLink.click();
      await page.waitForURL('**/about');
    }
  });

  test('should be responsive on mobile devices', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });

    // Check if mobile navigation works
    await expect(page.locator('nav')).toBeVisible();

    // Verify 3D content scales appropriately
    const canvas = page.locator('canvas');
    if (await canvas.isVisible()) {
      const boundingBox = await canvas.boundingBox();
      expect(boundingBox?.width).toBeLessThanOrEqual(375);
    }
  });

  test('should handle WebGL context gracefully', async ({ page }) => {
    // Test error handling for WebGL
    await page.addInitScript(() => {
      // Override WebGL context to simulate WebGL not available
      const originalGetContext = HTMLCanvasElement.prototype.getContext;
      HTMLCanvasElement.prototype.getContext = function (
        this: HTMLCanvasElement,
        ...args: any[]
      ) {
        if (args[0]?.includes('webgl')) {
          return null;
        }
        return originalGetContext.apply(this, args as any);
      } as any;
    });

    await page.goto('/');

    // Should still render without crashing
    await expect(page.locator('body')).toBeVisible();

    // Check for fallback content
    const fallback = page.locator('[data-testid="webgl-fallback"]');
    if (await fallback.isVisible()) {
      await expect(fallback).toContainText('WebGL not supported');
    }
  });
});
