import { type Locator, type Page } from '@playwright/test';

export type ElementRole = 'combobox' | 'textbox';
export class SearchBox {
    private readonly page: Page;
    private readonly searchBoxLocator: Locator;
    private readonly suggestionLocator: Locator;
    private readonly locationSuggstionLocator: Locator;
    private readonly suggestionDivOverloads: boolean;

    constructor(page: Page, suggestionDivOverloads: boolean) {
        this.page = page;
        this.searchBoxLocator = page.getByPlaceholder(/zoek op plaats/i);
        this.suggestionLocator = page.getByTestId('searchBoxSuggestions-mobile');
        this.suggestionDivOverloads = suggestionDivOverloads;
        
        this.locationSuggstionLocator = page.getByTestId('SearchBox-location-suggestion');
    }

    async selectFirstMatchedLocation(inputText: string) {

        const isInputVisible = await this.searchBoxLocator.isVisible();
    
        if (!isInputVisible) {
            await this.suggestionLocator.waitFor({state: 'visible'});
            await this.suggestionLocator.hover({ force: true });
            //await this.page.waitForTimeout(500);            
            await this.suggestionLocator.click({ force: true });

            await this.searchBoxLocator.waitFor({ state: 'visible' });
        } else {
            await this.searchBoxLocator.click();
        }

        await this.searchBoxLocator.fill(inputText);
        await this.locationSuggstionLocator.first().click();
    }

    getLocator() : Locator{
        return this.searchBoxLocator;
    }
}