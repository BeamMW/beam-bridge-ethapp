import { createEvent, restore } from 'effector';
import { Currency } from '@core/types';

export const currencies : Currency[] = [
    {name: "USDT", id: 1, decimals: 8},
    {name:'WBTC', id: 2, decimals: 8},
    {name:'DAI', id: 3, decimals: 8}
];

export const setCurrency = createEvent<Currency>();
export const $selectedCurrency = restore(setCurrency, currencies[0]);