import { createEvent, restore } from 'effector';

export enum View {
  CONNECT,
  BALANCE,
  SEND,
}

export const setView = createEvent<View>();
export const $view = restore(setView, View.CONNECT);

export const setAccounts = createEvent<string[]>();
export const $accounts = restore(setAccounts, null);

export const setEthBalance = createEvent<number>();
export const $ethBalance = restore(setEthBalance, null);

export const setUsdtBalance = createEvent<number>();
export const $usdtBalance = restore(setUsdtBalance, null);

export const setIncome = createEvent<{id: string, amount: string}[]>();
export const $income = restore(setIncome, null);