import { expect } from '@playwright/test'

import { When, Then } from 'steps/fixture.ts'

Then('I see bookmarked question {string}', async function () {
    expect(await this.questionPage.isCurrentQuestionBookmarked()).toBe(true)
})

When('I click bookmark {string}', async function (questionTitle: string) {
    await this.questionPage.gotoBookmark(questionTitle)
})

When('I bookmark question {string}', async function () {
    await this.questionPage.bookmark()
})

When('I delete bookmark {string}', async function (questionTitle: string) {
    await this.questionPage.unBookmark(questionTitle)
})

Then('I see bookmark link {string}', async function (questionTitle: string) {
    await expect(this.questionPage.bookmarkListLocator(questionTitle)).toBeVisible()
})

Then("I don't see bookmark link {string}", async function (questionTitle: string) {
    await expect(this.questionPage.bookmarkListLocator(questionTitle)).toBeHidden()
})

Then('I see bookmark to previous question {string}', async function (prevQuestionTitle: string) {
    // Ověří, že v seznamu bookmarků na aktuální stránce je odkaz na předchozí otázku
    await expect(this.questionPage.bookmarkListLocator(prevQuestionTitle)).toBeVisible()
})

Then('I see bookmark link to previous question {string}', async function (prevQuestionTitle: string) {
    // Ověří, že v seznamu bookmarků je tlačítko/odkaz na předchozí otázku
    await expect(this.questionPage.bookmarkListLocator(prevQuestionTitle)).toBeVisible()
})
