import { FilterTabBase  } from "./filtertabbase";
import { SearchType } from '../../types/searchType';
import { type Locator, type Page } from '@playwright/test';


export class FilterTabLaptop extends FilterTabBase {
    
    private readonly filtersButton : Locator;
    private readonly filtersDialog : Locator;
    private readonly filtersApplyButton : Locator;
    private priceToLocator : Locator;
    private readonly objectTypeHouseCheckBoxLocator: Locator;

    private readonly selectedFilterPrice: Locator;
    private readonly selectedFilterObjectTypeLocator: Locator;

    constructor(page: Page) {
        super(page);
        this.filtersButton = page.getByRole('button', { name: /^Filters/ });
        this.filtersDialog = page.getByTestId('dialog-content');
        this.filtersApplyButton = this.filtersDialog.getByTestId('FilterPanelFooterButton');
        this.priceToLocator = this.filtersDialog.locator('#price_to');
        this.selectedFilterPrice = this.filtersDialog.getByTestId('SelectedFilterprice');
        this.objectTypeHouseCheckBoxLocator = this.filtersDialog.locator('#checkbox-object_type-house');
        this.selectedFilterObjectTypeLocator =  this.filtersDialog.getByTestId('SelectedFilterobject_type');
    }

    async showFilterTabIfNeeded() : Promise<void> {
        await this.filtersButton.click();
        await this.filtersDialog.waitFor({ state:'visible' });
        this.isOpened = true;
    }

    async backToResultsIfNeeded() : Promise<void> {
        await this.filtersApplyButton.waitFor({state:'visible'});
        await this.filtersApplyButton.click();
        this.isOpened = false;
    }

    protected getPriceToLocator() : Locator {
        super.assertAccessWhenTabIsClosed();
        return this.priceToLocator;
    }

    getSelectedFilterPriceLocator() : Locator {
        super.assertAccessWhenTabIsClosed();
        return this.selectedFilterPrice;
    }

    protected getHouseCheckboxLocator() : Locator {
        super.assertAccessWhenTabIsClosed();
        return this.objectTypeHouseCheckBoxLocator;
    }

    getSelectedHouseTypeLocator() : Locator {
        return this.selectedFilterObjectTypeLocator;
    }
}