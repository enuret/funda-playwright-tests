import { SearchResultsPage } from '../pages/searchresults';
import { expect, Page } from '@playwright/test';
import {SearchType} from '../types/searchType'
import { type Locator } from '@playwright/test';
import { FilterTabBase } from '../components/filtertab/filtertabbase';

/**
 * verifies that
 *  - search results header contains expected Area name (if specified)
 *  - search results header contains the text correct kind of search (koop/huur) 
 *  - there is at least one result in the results list
 * @param searchResults the instance of SearchResultsPage
 * @param areaTextToContain expected name of Area to see in header, if it is undefined it is not checked
 * @param searchType - kind of search
 */
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
    await validateCustomFilter(
        priceFilterLocator,
        //remove everything except of numbers for easier validation
        (val) => val.replace(/[^0-9-]/g, ''),
        `${maxPrice}`
    );
}

/**
 * Validates that textContent() of filterLocator corresponds to expectedValues
 * @param filterLocator - a locator with a text content to validate
 * @param valueCleaner - a function to normalize the text on a locator (remove extra symbols for example)
 * @param expectedValue - a value we expect to see after normalizing
 */
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

/**
 * opens filters tab, sets up house type check box and returns back 
 * to the search and validates search results
 * @param filterTab FilterTab object
 * @param searchResultsPage active SearchResultsPage object
 * @param searchType type of search
 */
export async function testFilteringCheckboxHouse(
    filterTab: FilterTabBase,
    searchResultsPage: SearchResultsPage,
    searchType: SearchType) {
    // filter by property type and validate
    await filterTab.showFilterTabIfNeeded();
    await filterTab.selectHouseType();
    await validateCustomFilter(
        filterTab.getSelectedHouseTypeLocator(),
        //remove everything except of letters, and lowercase it
        (val) => val.replace(/[^a-zA-Z]/g, '').toLowerCase(),
        'woonhuis'
    );
    await filterTab.backToResultsIfNeeded();
    await verifySearchResults(searchResultsPage, undefined, searchType);
}

/**
 * opens filters tab, sets up max price to a provided value and returns back 
 * to the search and validates search results
 * @param filterTab FilterTab object
 * @param searchResultsPage active SearchResultsPage object
 * @param searchType type of search
 * @param priceTo price to set up
 */
export async function testFilteringPriceMax(
    filterTab: FilterTabBase,
    searchResultsPage: SearchResultsPage,
    searchType: SearchType,
    priceTo: number) {
        await filterTab.showFilterTabIfNeeded();
        await filterTab.selectTabIfNotActive(searchType);
        // filter by price_to and validate
        await filterTab.setPriceTo(priceTo);
        await validatePriceRangeFilter(filterTab.getSelectedFilterPriceLocator(), priceTo);
        await filterTab.backToResultsIfNeeded();
        await verifySearchResults(searchResultsPage, undefined, searchType);   
    }

/**
 * Creates a SearchResultsPage and navigates to the koop|huur search as specified
 * @param page active page object
 * @param searchType kind of search to open
 * @returns 
 */

export async function setupSearch(page: Page, searchType: SearchType): Promise<SearchResultsPage> {
    const searchResultsPage = new SearchResultsPage(page);
    await searchResultsPage.goto(searchType);
    return searchResultsPage;
}

