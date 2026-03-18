import { FilterTabBase  } from "./filtertabbase";
import { SearchType } from '../../types/searchType';
import { type Locator, type Page } from '@playwright/test';


export class FilterTabWideScreen extends FilterTabBase {
    
    private priceToLocator : Locator;
    private readonly selectedFilterPrice: Locator;
    private readonly objectTypeHouseCheckBoxLocator: Locator;
    readonly selectedFilterObjectTypeLocator: Locator;


    constructor(page: Page) {
        super(page);
        /// the tab is always shown in the wide screen
        this.isOpened = true;
        this.priceToLocator = page.getByRole('combobox', { name: 'Tot €' });
        this.selectedFilterPrice = page.getByTestId('SelectedFilterprice');
        this.objectTypeHouseCheckBoxLocator = page.locator('#checkbox-object_type-house'); 
        this.selectedFilterObjectTypeLocator =  page.getByTestId('SelectedFilterobject_type');
               
    }

    showFilterTabIfNeeded() : Promise<void> {
        return Promise.resolve();
    }

    backToResultsIfNeeded() : Promise<void> {
        return Promise.resolve();
    }

    protected getPriceToLocator() : Locator {
        return this.priceToLocator;
    }

    getSelectedFilterPriceLocator() : Locator {
        super.assertAccessWhenTabIsClosed();
        return this.priceToLocator;
    }

    protected getHouseCheckboxLocator() : Locator {
        return this.objectTypeHouseCheckBoxLocator;
    }

    getSelectedHouseTypeLocator() : Locator {
        return this.selectedFilterObjectTypeLocator;
    }
}