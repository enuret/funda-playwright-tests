import { type Locator, type Page } from '@playwright/test';

export class GDPRPopup {
    private readonly dialogLocator: Locator;
    private readonly acceptButtonLocator: Locator;
    

    constructor(page: Page) {
        this.dialogLocator = page.getByRole('dialog', { name: /Welkom bij Funda/i });
        this.acceptButtonLocator = page.getByRole('button', { name: /Alles accepteren/i });
    }

    getLocator() : Locator {
        return this.dialogLocator;
    }

    async agreeConsent() : Promise<void> {
        await this.acceptButtonLocator.click();
    }
}