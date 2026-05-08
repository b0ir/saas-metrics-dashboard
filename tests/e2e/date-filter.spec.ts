import { test, expect } from '@playwright/test'

test.describe('Date range filter', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
  })

  test('defaults to 90 days selected', async ({ page }) => {
    const btn90 = page.getByTestId('range-90')
    await expect(btn90).toBeVisible()
    // The active button has the accent background class
    await expect(btn90).toHaveClass(/bg-accent/)
  })

  test('switching to 30 days updates the period label', async ({ page }) => {
    await expect(page.getByText(/90 días seleccionados/)).toBeVisible()
    await page.getByTestId('range-30').click()
    await expect(page.getByText(/30 días seleccionados/)).toBeVisible()
  })

  test('switching to 365 days updates the period label', async ({ page }) => {
    await page.getByTestId('range-365').click()
    await expect(page.getByText(/365 días seleccionados/)).toBeVisible()
  })

  test('active range button is visually highlighted', async ({ page }) => {
    await page.getByTestId('range-30').click()
    await expect(page.getByTestId('range-30')).toHaveClass(/bg-accent/)
    await expect(page.getByTestId('range-90')).not.toHaveClass(/bg-accent/)
  })
})
