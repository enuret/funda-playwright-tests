import { type Locator, type Page } from '@playwright/test';
import { SearchBox } from '../components/SearchBox';
import { SearchTab, SearchTabName } from '../components/SearchTab';


export class MainPage {

    readonly searchBox : SearchBox;

    private readonly page: Page;
    private readonly loginButtonLocator: Locator;

    constructor(page: Page) {
        this.page = page;
        this.searchBox = new SearchBox(page, false);
        this.loginButtonLocator = page.getByRole('button', { name: /inloggen/i });
    }

    async goto() : Promise<void> {
        await this.page.goto('/');
        await this.page.waitForLoadState('networkidle');
    } 

    async getSearchTabByName(tabName: SearchTabName) {
        return new SearchTab(this.page, tabName);
    }

    async navigateToLoginPage() : Promise<void> {
        await this.loginButtonLocator.click();
    }
}