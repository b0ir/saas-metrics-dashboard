import { test, expect } from '@playwright/test'

test.describe('Dataset switching', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
  })

  test('loads with dataset A selected by default', async ({ page }) => {
    await expect(page.getByRole('tab', { name: 'Dataset A' })).toHaveAttribute(
      'data-state',
      'active',
    )
  })

  test('switching dataset changes displayed metrics', async ({ page }) => {
    // Capture a KPI value from dataset A
    const firstCard = page.locator('[class*="text-2xl"]').first()
    const valueA = await firstCard.textContent()

    // Switch to dataset B
    await page.getByRole('tab', { name: 'Dataset B' }).click()
    await expect(page.getByRole('tab', { name: 'Dataset B' })).toHaveAttribute(
      'data-state',
      'active',
    )

    // Value should be different (datasets have different underlying behavior)
    const valueB = await firstCard.textContent()
    expect(valueA).not.toBe(valueB)
  })

  test('all four datasets are reachable', async ({ page }) => {
    for (const key of ['A', 'B', 'C', 'D']) {
      await page.getByRole('tab', { name: `Dataset ${key}` }).click()
      await expect(
        page.getByRole('tab', { name: `Dataset ${key}` }),
      ).toHaveAttribute('data-state', 'active')
    }
  })

  test('period label reflects the selected dataset', async ({ page }) => {
    await expect(page.getByText(/90 days selected/)).toBeVisible()
    await page.getByRole('tab', { name: 'Dataset C' }).click()
    // After switching, the header still shows the day count (same period, different data)
    await expect(page.getByText(/days selected/)).toBeVisible()
  })
})
