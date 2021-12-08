import { createEvent, restore, createEffect } from 'effector';
import { Balance } from '@core/types';
import { currencies, ethId } from '@consts/common';
import { isNil } from '@core/utils';

const API_URL = 'https://masternet-explorer.beam.mw/bridges/';
const RATE_API_URL = 'https://api.coingecko.com/api/v3/simple/price';

export enum View {
  CONNECT,
  BALANCE,
  SEND,
  RECEIVE,
  LOADER
}

export const setView = createEvent<View>();
export const $view = restore(setView, View.LOADER);

export const setAccounts = createEvent<string[]>();
export const $accounts = restore(setAccounts, null);

$accounts.watch(value => {
  if (!isNil(value) && value.length > 0) {
      setView(View.BALANCE);
  } else if (!isNil(value) && value.length === 0) {
      setView(View.CONNECT);
  } else {
      setView(View.LOADER);
  }
});

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
      const trs = await fetch(`${API_URL}tokens_transfer/${address}/${item.ethTokenContract}`)
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

export const getRateFx = createEffect(async () => {
  let rate_ids = [];
  for (let curr of currencies) {
    rate_ids.push(curr.rate_id);
  }
  const response = await fetch(`${RATE_API_URL}?ids=${rate_ids.join(',')}&vs_currencies=usd`, {
    mode: 'cors',
    headers: {
      'Access-Control-Allow-Origin':'*'
    }
  });
  const promise: Promise<any> = response.json();
  return promise;
});

export const $rate = restore(
  getRateFx.doneData.map((data) => {
    console.log(data);
    return data;
  }), null,
);

getRateFx.doneData.watch(() => setTimeout(getRateFx, 60000));
