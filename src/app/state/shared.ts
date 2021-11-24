import { createEvent, restore } from 'effector';
import { Balance } from '@core/types';

export enum View {
  CONNECT,
  BALANCE,
  SEND,
}

export const setView = createEvent<View>();
export const $view = restore(setView, View.CONNECT);

export const setAccounts = createEvent<string[]>();
export const $accounts = restore(setAccounts, null);

export const setBalance = createEvent<Balance[]>();
export const $balance = restore(setBalance, []);

export const setIsInProgress = createEvent<boolean>();
export const $isInProgress = restore(setIsInProgress, false);



export const setEthBalance = createEvent<number>();
export const $ethBalance = restore(setEthBalance, null);

export const setUsdtBalance = createEvent<number>();
export const $usdtBalance = restore(setUsdtBalance, null);

export const setIncome = createEvent<{id: number, amount: number}[]>();
export const $income = restore(setIncome, null);