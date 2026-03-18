
import { expect, type Page } from '@playwright/test';
import { test } from '../fixtures/block.ads';
import { SearchType } from '../types/searchType';
import { SearchResultsPage } from '../pages/searchresults';
import { PropertyPage } from '../pages/propertypage';
import { ContactPage } from '../pages/contactpage';


function propertyCardUrlRegexp(searchType: SearchType) : RegExp {
    if (searchType == SearchType.BUY){
        return /detail\/.*koop.*/i;
    } else if (searchType == SearchType.RENT){
        return /detail\/.*huur.*/i;
    }
    
    throw Error('Unrecognized property type');
}

async function openPropertyPage(
    page: Page, 
    searchType: SearchType,
    projectName: string
) : Promise<PropertyPage> 
{
    const searchResultsPage = new SearchResultsPage(page);
    await searchResultsPage.goto(searchType);
    const filterTab = searchResultsPage.getFilterTab(projectName);
    
    await filterTab.showFilterTabIfNeeded();
    await filterTab.selectTabIfNotActive(searchType);
    await filterTab.backToResultsIfNeeded();

    const firstProperty = searchResultsPage.searchResultsLocator.first();
    await expect(firstProperty).toBeVisible();
    await firstProperty.click();

    const pageUrlRegexp = propertyCardUrlRegexp(searchType);

    await expect(page).toHaveURL(pageUrlRegexp);
    const propertyPage = new PropertyPage(page);
    await propertyPage.waitForPageLoaded();
    return propertyPage;
}

async function verifyContactPage(page: Page) {
    const contactPage = new ContactPage(page);
    await expect(contactPage.questionInputLocator).toBeEditable();
    await expect(contactPage.submitButton).toBeEnabled();
}


test.describe('Smoke tests for property card @smoke', () => {
    const searches = [
        {
            searchType: SearchType.BUY
        },
        {
            searchType: SearchType.RENT
        }
    ];

    for (const { searchType } of searches) {
        test(`test property card information ${searchType}`, async ({ page }, testInfo) => {
            const propertyPage = await openPropertyPage(page, searchType, testInfo.project.name);
            
            //expect that the title address is not empty
            await expect (propertyPage.addressTitleLocator).not.toBeEmpty();
            
            //expect that the initial description is not empty 
            await expect (propertyPage.descriptionLocatorHeader).toBeVisible()
            await expect (propertyPage.descriptionLocatorHeader).not.toBeEmpty();

            await propertyPage.expandDescription();

            //expect that the the full description is visible 
            await expect(propertyPage.descriptionLocator).toBeAttached();
            await expect(propertyPage.descriptionLocator).toBeVisible();
            await expect(propertyPage.descriptionLocator).toHaveAttribute('data-state', 'open');
            await expect (propertyPage.descriptionLocator).not.toBeEmpty();
        });

        test(`test property card contact button ${searchType}`, async ({ page }, testInfo) => {
            const propertyPage = await openPropertyPage(page, searchType, testInfo.project.name);
            await propertyPage.goToContactPage();
            await verifyContactPage(page);
        });

        test(`test property card request viewing button ${searchType}`, async ({ page }, testInfo) => {
            const propertyPage = await openPropertyPage(page, searchType, testInfo.project.name);
            await propertyPage.goToRequestViewing();
            await verifyContactPage(page);
        });
    }
});