import { expect } from '@playwright/test';
import { test } from '../fixtures/block.ads';
import { SearchType } from '../types/searchType';
import { DEFAULT_SEARCH_VALUES, PAGE_URL_PARAM_NAME } from '../constants/constants';
import { verifySearchResults, testFilteringPriceMax, setupSearch } from '../utils/helpers';


test.describe('Smoke tests for search @smoke', () => {
  const tests = [
      {
          searchType: SearchType.BUY,
          maxPrice: DEFAULT_SEARCH_VALUES.PRICE_TO_BUY
      },
      { 
          searchType: SearchType.RENT,
          maxPrice: DEFAULT_SEARCH_VALUES.PRICE_TO_RENT
      },
  ];

    for (const { searchType, maxPrice } of tests) {

        test(`search results base search ${searchType} with filters`, async ({ page }, testInfo) => {
            const searchResultsPage = await setupSearch(page, searchType);

            await searchResultsPage.searchBox.selectFirstMatchedLocation(DEFAULT_SEARCH_VALUES.AREA);
            await verifySearchResults(searchResultsPage, DEFAULT_SEARCH_VALUES.AREA, searchType);
          
            // verify search one filter
            const filterTab = searchResultsPage.getFilterTab(testInfo.project.name);
          
            // filter by price and validate search
            await testFilteringPriceMax(filterTab, searchResultsPage, searchType, maxPrice);
        });

        test(`search results pagination ${searchType}`, async ({ page }) => {
            const searchResultsPage = await setupSearch(page, searchType);
            await searchResultsPage.navigateNextPage();
            /// check that url has changed to page=2
            await expect(page).toHaveURL(new RegExp(`${PAGE_URL_PARAM_NAME}=2`, 'i'));
            await verifySearchResults(searchResultsPage, undefined, searchType);
        });
    }

});

