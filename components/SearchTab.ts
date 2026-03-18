import { type Locator, type Page } from '@playwright/test';

export enum SearchTabName {
    BUY = "Koop",
    RENT = "Huur", 
}

export class SearchTab {
    
    private readonly locator: Locator;

    constructor(page: Page, tabName: SearchTabName) {
        this.locator = page.getByRole('tab', { name: tabName });
    }

    async selectTabIfNotActive() {
        let isSelected = await this.locator.getAttribute('aria-selected');
        if (isSelected !== "true") {
            await this.locator.click();
            isSelected = await this.locator.getAttribute('aria-selected');
            if (isSelected !== "true") {
                await this.locator.click();
            }
        }
    }
}
