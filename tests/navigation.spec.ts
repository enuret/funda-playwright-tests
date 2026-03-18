import { type Page } from '@playwright/test';
import { MainPage } from '../pages/mainpage';
import { SearchResultsPage } from '../pages/searchresults';
import { DEFAULT_SEARCH_VALUES, EXPECTED_URLS } from '../constants/constants';
import { SearchTabName } from '../components/SearchTab';
import { verifyPageUrl, verifySearchResults } from '../utils/helpers'; 
import { SearchType } from '../types/searchType';
import { test } from '../fixtures/block.ads';


async function openMainPage(page : Page){
    const mainPage = new MainPage(page);
    await mainPage.goto();
    return mainPage;
}

test.describe('Smoke tests for search @smoke', () => {
    const searches = [
        { 
            tabName: SearchTabName.BUY, 
            urlToExpect: EXPECTED_URLS.BUY,
            searchType: SearchType.BUY
        },
        { 
            tabName: SearchTabName.RENT, 
            urlToExpect: EXPECTED_URLS.RENT,
            searchType: SearchType.RENT
        }
    ];

    for (const { tabName, urlToExpect, searchType } of searches) {
        test(`search navigation from main page ${tabName}`, async ({ page }) => {
                //select the right tab
                const mainPage = await openMainPage(page);
                const searchTab = await mainPage.getSearchTabByName(tabName);
                await searchTab.selectTabIfNotActive();

                //look for a default area
                await mainPage.searchBox.selectFirstMatchedLocation(DEFAULT_SEARCH_VALUES.AREA);
                await verifyPageUrl(page, urlToExpect);

                await verifySearchResults(new SearchResultsPage(page), DEFAULT_SEARCH_VALUES.AREA, searchType);
            });
    }

    test("login page navigation", async ({ page }) => {
        const mainPage = await openMainPage(page);
        await mainPage.navigateToLoginPage();
        await verifyPageUrl(page, EXPECTED_URLS.LOGIN);
    });
});