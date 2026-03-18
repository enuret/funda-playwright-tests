import { expect } from '@playwright/test';
import { SearchType } from '../types/searchType';
import { setupSearch, 
         testFilteringCheckboxHouse, 
         testFilteringPriceMax 
        } from '../utils/helpers';
import { SearchResultsPage } from '../pages/searchresults';
import { DEFAULT_SEARCH_VALUES } from '../constants/constants';
import { test } from '../fixtures/block.ads';


const searches = [
    { 
        searchType: SearchType.BUY,
        priceTo: DEFAULT_SEARCH_VALUES.PRICE_TO_BUY
    },
    { 
        searchType: SearchType.RENT,
        priceTo: DEFAULT_SEARCH_VALUES.PRICE_TO_RENT
    }
];

for (const { searchType, priceTo } of searches) {

    test.describe(`${searchType} tests for filters @smoke`, () => {

        test(`filters checkbox filter for ${searchType}`, async ({ page }, testInfo) => {
            const searchResultsPage = await setupSearch(page, searchType);
            const filterTab = searchResultsPage.getFilterTab(testInfo.project.name);
            // filter by property type and validate search
            await testFilteringCheckboxHouse(filterTab, searchResultsPage, searchType);
        });

        test(`filter numeric and filter combination for ${searchType}`, async ({ page }, testInfo) => {
            const searchResultsPage = await setupSearch(page, searchType);
            const filterTab = searchResultsPage.getFilterTab(testInfo.project.name);
            // filter by price and validate search
            await testFilteringPriceMax(filterTab, searchResultsPage, searchType, priceTo);
            // filter by property type and validate search
            await testFilteringCheckboxHouse(filterTab, searchResultsPage, searchType);
        });


        test(`filters show more checkboxes ${searchType}`, async ({ page }, testInfo) => {
            const searchResultsPage = await setupSearch(page, searchType);
            const filterTab = searchResultsPage.getFilterTab(testInfo.project.name);
            await filterTab.showFilterTabIfNeeded();
            await filterTab.selectTabIfNotActive(searchType);
            await expect(filterTab.showMoreLocator).toBeVisible();
            await filterTab.showMoreLocator.click();

            await expect(filterTab.hiddenCheckbox).toBeVisible();
            
        });
    });
}

