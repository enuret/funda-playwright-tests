import { type Locator, type Page } from '@playwright/test';
import { SearchType } from '../../types/searchType';


enum FilterTabName {
    BUY = "Koop",
    RENT = "Huur", 
}


export abstract class FilterTabBase {

    protected readonly page: Page;

    readonly buyTabLocator: Locator;
    readonly rentTabLocator: Locator;

    //show more locator
    readonly showMoreLocator: Locator;
    readonly hiddenCheckbox: Locator;

    protected isOpened: boolean;

    constructor(page: Page) {
        this.page = page;
        this.isOpened = false;
        this.buyTabLocator = page.getByRole('tab', { name: "Koop" });
        this.rentTabLocator = page.getByRole('tab', { name: "Huur" });

        //right section with hidden checkbox
        const section = page.locator('div')
                           .filter({ hasText: 'Soort aanbod' })
                            .filter({ hasNotText: 'Soort bouw'});
                       
        this.showMoreLocator = section.getByRole('button', { name: "Toon meer" });
        this.hiddenCheckbox = page.locator('#checkbox-object_type-storage_space');
    }

    abstract showFilterTabIfNeeded() : Promise<void>;
    abstract backToResultsIfNeeded() : Promise<void>;

    async setPriceTo(priceTo : number) {
        this.assertAccessWhenTabIsClosed();
        await this.getPriceToLocator().click();
        await this.getPriceToLocator().fill(priceTo.toString());
        await this.getPriceToLocator().press('Enter');
    }

    async selectHouseType() {
        this.assertAccessWhenTabIsClosed();
        let isChecked = await this.getHouseCheckboxLocator().isChecked();
        if (isChecked === true) return; 

        await this.getHouseCheckboxLocator().check();
    }

    async selectTabIfNotActive(searchType: SearchType) {
        this.assertAccessWhenTabIsClosed();
        const locator = searchType == SearchType.BUY ? this.buyTabLocator : this.rentTabLocator;
        const isSelected = await locator.getAttribute("aria-pressed");
        
        if (isSelected !== "true"){
            await locator.click();
        }
    }

    protected assertAccessWhenTabIsClosed() {
        if (!this.isOpened){
            throw Error('The filters dialog should be open before using this method!');
        }
    }

    protected abstract getPriceToLocator() : Locator;

    abstract getSelectedFilterPriceLocator() : Locator;

    protected abstract getHouseCheckboxLocator() : Locator;

    abstract getSelectedHouseTypeLocator() : Locator;
}
