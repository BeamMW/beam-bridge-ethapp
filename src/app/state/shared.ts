import { createEvent, restore, createEffect } from 'effector';
import { Balance } from '@core/types';
import { currencies, ethId } from '@consts/common';

export enum View {
  CONNECT,
  BALANCE,
  SEND,
  RECEIVE
}

export const setView = createEvent<View>();
export const $view = restore(setView, View.CONNECT);

export const setAccounts = createEvent<string[]>();
export const $accounts = restore(setAccounts, null);

export const setBalance = createEvent<Balance[]>();
export const $balance = restore(setBalance, []);

export const setIsInProgress = createEvent<boolean>();
export const $isInProgress = restore(setIsInProgress, false);

export const setIncome = createEvent<{id: number, amount: number}[]>();
export const $income = restore(setIncome, null);


export const getTransactionsListFx = createEffect(async (address) => {
  let result = [];
  for (var item of currencies) {
    if (item.id !== ethId) {
      const trs = await fetch(`https://masternet-explorer.beam.mw/bridges/tokens_transfer/${address}/${item.ethTokenContract}`)
      result = result.concat(await trs.json());
    }
  }
  return result;
});

export const $transactionsList = restore(
  getTransactionsListFx.doneData.map((data) => {
    return data;
  }), null,
);
