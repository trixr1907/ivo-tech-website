import { test, expect } from '@playwright/test';

// Sample test navigating through 3D scene
// WebGL functionality is mocked through the config

const PAGE_URL = '/';

// E2E test for EpicScene3D component

test.describe('EpicScene3D', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(PAGE_URL);
  });

  test('should load the 3D scene without crashing', async ({ page }) => {
    await expect(page.locator('canvas')).toBeVisible();
  });

  test('should display the epic center content', async ({ page }) => {
    const element = page.locator('text=Epic Centered Label');
    await expect(element).toBeVisible();
  });

  test('should interact with 3D components correctly', async ({ page }) => {
    // Simulate interaction
    await page.click('text=Rotate');
    const object = page.locator('text=Rotating Sphere');
    await expect(object).toHaveClass(/spinning/);
  });
});
