import { SearchType } from '../types/searchType';

export const DEFAULT_SEARCH_VALUES = {
    /// Assuming that these filters always return some results
    AREA: 'Amsterdam',
    TYPE: SearchType.BUY,
    PRICE_TO_BUY:   1_000_000,
    PRICE_TO_RENT:   3_000,
};


export const EXPECTED_URLS = {
    BUY: '/zoeken/koop',
    RENT: '/zoeken/huur',
    LOGIN: '/account/login'
}

export const PAGE_URL_PARAM_NAME = 'search_result';

export const WIDE_SCREEN_PROJECT_NAME = 'widescreen';
export const LAPTOP_PROJECT_NAME = 'laptop';
