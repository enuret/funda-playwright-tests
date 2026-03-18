// fixtures.ts
import { test as base } from '@playwright/test';

export const test = base.extend({
    page: async ({ page }, use) => {
        await page.route('**/*doubleclick*', route => route.abort());
        await page.route('**/*googlesyndication*', route => route.abort());
        await page.route('**/*pubmatic*', route => route.abort());
        await page.route('**/*googletagservices*', route => route.abort());
        await page.route('**/*siteintercept.qualtrics.com*', route => route.abort());
        await page.route('**/*securepubads.g.doubleclick.net*', route => route.abort());
//        await page.route('**/*.jpg', route => route.abort());
        await use(page);
    }
});
