import { SearchResultsPage } from '../pages/searchresults';
import { expect, Page } from '@playwright/test';
import {SearchType} from '../types/searchType'
import { type Locator } from '@playwright/test';


export async function verifySearchResults(
    searchResults: SearchResultsPage, 
    areaTextToContain: string | undefined,
    searchType: SearchType
) {
    if (areaTextToContain){
        await expect (searchResults.pageHeader).toContainText(areaTextToContain);
    }
    const searchTypeTextToExpect = searchType == SearchType.BUY ? "koop" : "huur";
    await expect (searchResults.pageHeader).toContainText(searchTypeTextToExpect);
    await expect(searchResults.searchResultsLocator.first()).toBeVisible();
}

export async function validatePriceRangeFilter(
    priceFilterLocator: Locator,
    maxPrice: number 
){
    validateCustomFilter(
        priceFilterLocator,
        //remove everything except of numbers for easier validation
        (val) => val.replace(/[^0-9-]/g, '').toLowerCase().trim(),
        `${maxPrice}`
    );
}

export async function validateCustomFilter(
    filterLocator: Locator,
    valueCleaner: (text: string) => string,
    expectedValue: string
) {
    await expect(filterLocator).toBeVisible();
    const filterText = await filterLocator.textContent();
    expect(filterText).not.toBeNull();
    if(filterText){
        const cleanRange = valueCleaner(filterText);
        expect(cleanRange).toBe(expectedValue);
    }
}
export async function verifyPageUrl(page: Page, urlToExpect: string) {
    await expect(page).toHaveURL(new RegExp(urlToExpect, 'i'));
}
