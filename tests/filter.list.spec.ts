import { expect, type Page } from '@playwright/test';
import { SearchType } from '../types/searchType';
import { verifySearchResults, validatePriceRangeFilter, validateCustomFilter } from '../utils/helpers';
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

async function setupSearch(page: Page, searchType: SearchType) 
  : Promise<SearchResultsPage> {
    const searchResultsPage = new SearchResultsPage(page);
    await searchResultsPage.goto(searchType);    
    return searchResultsPage;
}

for (const { searchType, priceTo } of searches) {

    test.describe(`Smoke ${searchType} tests for filters @smoke`, () => {

        test(`filters tab function for ${searchType} filter combination`, async ({ page }, testInfo) => {
            const searchResultsPage = await setupSearch(page, searchType);
            const filterTab = searchResultsPage.getFilterTab(testInfo.project.name);
            
            await filterTab.showFilterTabIfNeeded();
            await filterTab.selectTabIfNotActive(searchType);
            // filter by price_to and validate
            await filterTab.setPriceTo(priceTo);
            await validatePriceRangeFilter(filterTab.getSelectedFilterPriceLocator(), priceTo);
            await filterTab.backToResultsIfNeeded();
            await verifySearchResults(new SearchResultsPage(page), undefined, searchType);
            
            // filter by property type and validate
            await filterTab.showFilterTabIfNeeded();
            await filterTab.selectHouseType();
            await validateCustomFilter(
                    filterTab.getSelectedHouseTypeLocator(),
                    (val) => val.replace(/[\s]/g, '').toLowerCase().trim(),
                    'woonhuis'
                );
            await filterTab.backToResultsIfNeeded();
            await verifySearchResults(new SearchResultsPage(page), undefined, searchType);
        });

        test(`filters checkbox filter for ${searchType}`, async ({ page }, testInfo) => {
            const searchResultsPage = await setupSearch(page, searchType);
            const filterTab = searchResultsPage.getFilterTab(testInfo.project.name);
            await filterTab.showFilterTabIfNeeded();
            await filterTab.selectTabIfNotActive(searchType);
            await filterTab.selectHouseType();
            await validateCustomFilter(
                    filterTab.getSelectedHouseTypeLocator(),
                    (val) => val.replace(/[\s]/g, '').toLowerCase().trim(),
                    'woonhuis'
                );
            await filterTab.backToResultsIfNeeded();
            await verifySearchResults(new SearchResultsPage(page), undefined, searchType);
        });

        test(`filters show more checkboxes   ${searchType}`, async ({ page }, testInfo) => {
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

