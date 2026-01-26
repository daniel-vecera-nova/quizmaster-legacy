import { expect, type Locator } from '@playwright/test'

export type TableOf<T> = { raw: () => T[] }

export const expectTextToBe = async (locator: Locator, text: string) => expect(await locator.textContent()).toBe(text)

export const expectTextToContain = async (locator: Locator, text: string) =>
    expect(await locator.textContent()).toContain(text)

export const expectThatIsVisible = async (locator: Locator) => expect(locator).toBeVisible()

export const expectThatIsNotVisible = async (locator: Locator) => expect(locator).toBeHidden()

export const expectedNumberOfChildrenToBe = async (locator: Locator, count: number) =>
    expect(await locator.count()).toBe(count)
