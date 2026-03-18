import { expect } from '@playwright/test';
import { GDPRPopup } from '../pages/gdprpopup';
import { MainPage } from '../pages/mainpage';
import { test } from '../fixtures/block.ads';


test('GDPR popup @smoke', async ({ browser }) => {
    const context = await browser.newContext({ 
        storageState: undefined 
    });
    const page = await context.newPage();

    const pageWithPopup = new GDPRPopup(page);
    const mainPage = new MainPage(page);
    
    //open the main page
    await mainPage.goto();
    //expect popup locator
    const popupLocator = pageWithPopup.getLocator();
    
    await expect(popupLocator).toBeVisible();
    await pageWithPopup.agreeConsent();
    await expect(popupLocator).toBeHidden();

    await page.context().storageState({ path: 'data/gdpr-state.json' });
});