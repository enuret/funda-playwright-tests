import { type Locator, type Page } from '@playwright/test';

export class PropertyPage {
    readonly page: Page;
    readonly addressTitleLocator: Locator;
    readonly descriptionLocator: Locator;
    readonly callLinkLocator: Locator;
    readonly descriptionLocatorHeader: Locator;

    private readonly expandButtonLcator: Locator;
    private readonly contactButtonLocator: Locator;
    private readonly contactRequestViewingLocator: Locator;
    private readonly showPhoneLocator: Locator;
    

    constructor(page: Page) {
        this.page = page;
        this.addressTitleLocator = page.locator('h1');

        const descriptionSection = page.locator('section')
                .filter({ has: page.getByRole('heading', { name: 'Omschrijving' }) });
        this.descriptionLocatorHeader = descriptionSection.getByTestId('expandable-panel-header');
        this.descriptionLocator = descriptionSection.getByTestId('expandable-panel');
        this.expandButtonLcator = descriptionSection.locator('button', { hasText: 'Lees de volledige' });
       
        const contactnSection = page.locator('div')
                .filter({ has: page.getByRole('link', { name: /Vraag bezichtiging aan/i }) })
                .filter({ hasNot: page.getByRole('heading', { name: 'Omschrijving' })});
        this.contactButtonLocator = contactnSection.getByRole('link', { name: /Neem contact op/i });
        this.contactRequestViewingLocator = contactnSection.getByRole('link', { name: /Vraag bezichtiging aan/i });
        this.showPhoneLocator = contactnSection.locator('a').filter({ hasText: 'Toon telefoonnummer' })
        this.callLinkLocator = contactnSection.locator('a[href^="tel:"]');
    }

    //waiting for page to stabilize
    async waitForPageLoaded() : Promise<void> {
        await this.expandButtonLcator.waitFor({state:'visible'});
        await this.showPhoneLocator.waitFor({state:'visible'});
    }

    async expandDescription() : Promise<void> {
        await this.expandButtonLcator.click();
        await this.expandButtonLcator.waitFor({state:'hidden'});
    }

    async goToContactPage() : Promise<void> {
        await this.contactButtonLocator.click();
    }

     async goToRequestViewing() : Promise<void> {
        await this.contactRequestViewingLocator.click();
    }

    async showPhone() : Promise<void> {
       await this.showPhoneLocator.click(); 
    }
}