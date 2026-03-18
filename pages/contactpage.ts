import { type Locator, type Page } from '@playwright/test';

export class ContactPage {
    readonly questionInputLocator: Locator;
    readonly submitButton: Locator;
    

    constructor(page: Page) {
        this.questionInputLocator = page.getByPlaceholder('Stel je vraag aan de makelaar');
        this.submitButton = page.getByRole('button', { name: 'Verstuur'});
    }

}