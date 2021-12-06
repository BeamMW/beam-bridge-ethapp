import { createEvent, restore } from 'effector';
import { Currency } from '@core/types';

export const setCurrency = createEvent<Currency>();
export const $selectedCurrency = restore(setCurrency, null);