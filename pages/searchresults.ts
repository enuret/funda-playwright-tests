import { type Locator, type Page } from '@playwright/test';
import { SearchType } from '../types/searchType';
import { SearchBox } from '../components/SearchBox';
import { FilterTabBase } from '../components/filtertab/filtertabbase';
import { FilterTabLaptop } from '../components/filtertab/filtertablaptop';
import { FilterTabWideScreen } from '../components/filtertab/filtertabwidescreen';
import { WIDE_SCREEN_PROJECT_NAME, LAPTOP_PROJECT_NAME } from '../constants/constants';

const SEARCH_RESULTS_TIMEOUT = 60_000;

export class SearchResultsPage {
    readonly searchResultsLocator: Locator;
    readonly searchBox : SearchBox;
    readonly pageHeader: Locator;

    private readonly page: Page;
    private readonly nextPageLocator: Locator;

    constructor(page: Page) {
        this.page = page;
        this.searchResultsLocator = page.getByTestId("listingDetailsAddress");
        this.nextPageLocator = this.page.getByRole('link', { name: 'Volgende' });
        this.pageHeader = page.getByTestId("pageHeader");
        this.searchBox = new SearchBox(page, true);
    }

    getFilterTab(projectName: string) : FilterTabBase {
        switch(projectName)
        {
            case WIDE_SCREEN_PROJECT_NAME:
                return new FilterTabWideScreen(this.page);
            case LAPTOP_PROJECT_NAME:
                return new FilterTabLaptop(this.page);
        }
        throw Error(`An attempt to get filter tab for unknown project ${projectName}`);
    }

    async goto(
        searchType: SearchType
    ) : Promise<void> {
        await this.page.goto(
            `/zoeken/${searchType}`,
            {'timeout':SEARCH_RESULTS_TIMEOUT}
        );
        await this.waitForSearchResults();
        // I chose to wait for networkidle because 
        // without access to the code base I do no know exactly
        // for what I could wait to make sure that all scripts and elements
        // are correctly loaded and attached
        await this.page.waitForLoadState('networkidle', {'timeout':SEARCH_RESULTS_TIMEOUT});
    }

    async waitForSearchResults(): Promise<void> {
        await this.searchResultsLocator.first().waitFor({ state: 'visible' });
    }

    async navigateNextPage() : Promise<void> {
        await this.nextPageLocator.click();
    }
}