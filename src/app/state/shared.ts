import { createEvent, restore, createEffect } from 'effector';
import { Balance } from '@core/types';
import { currencies, ethId } from '@consts/common';
import MetaMaskController  from '@core/MetaMask';
import { ROUTES } from '@app/shared/consts';

const metaMaskController = MetaMaskController.getInstance();

const API_URL = 'https://masternet-explorer.beam.mw/bridges/';
const RATE_API_URL = 'https://api.coingecko.com/api/v3/simple/price';

export enum View {
  LOADED,
  LOADING
}

export const remoteEvent = createEvent<any>();

remoteEvent.watch((args) => {
  if (args[0]) {
    setAccounts(args[0]);
  } else {
    setAccounts('');
    setView(ROUTES.CONNECT);
  }
});

export const setView = createEvent<string>();
export const $view = restore(setView, '/send');

export const setAccounts = createEvent<string>();
export const $accounts = restore(setAccounts, '');

export const setNetwork = createEvent<boolean>();
export const $isNetworkCorrect = restore(setNetwork, true);

const getTransations = async (address) => {
  let result = [];
  for (var item of currencies) {
    if (item.id !== ethId) {
      const trs = await fetch(`${API_URL}tokens_transfer/${address}/${item.ethTokenContract}`)
      result = result.concat(await trs.json());
    }
  }
  console.log(result);
  setTransactionList(result);
}

const getBalances = async (address: string) => {
  let balances: Balance[] = [];
  let balanceValue = 0;
  let isAllowed = false;
  for(let curr of currencies) {
    if (curr.id === ethId) {
      balanceValue = await metaMaskController.loadEthBalance(address);
      isAllowed = true;
    } else {
      balanceValue = await metaMaskController.loadTokenBalance(curr, address);
      isAllowed = await metaMaskController.loadAllowance(curr, address);
    }
    
    balances.push({
      curr_id: curr.id,
      icon: curr.name.toLowerCase(),
      rate_id: curr.rate_id,
      value: balanceValue,
      is_approved: isAllowed
    });
  }

  setBalance(balances);
} 

$accounts.watch(async (account) => {
  if (account.length > 0) {
    await getBalances(account);
    await getTransations(account);
    setInterval(async () => {
      await getBalances(account);
      await getTransations(account);
    }, 5000)
  }
})

export const setBalance = createEvent<Balance[]>();
export const $balance = restore(setBalance, []);

export const setIsInProgress = createEvent<boolean>();
export const $isInProgress = restore(setIsInProgress, false);

export const setIncome = createEvent<{id: number, amount: number}[]>();
export const $income = restore(setIncome, null);

const setTransactionList = createEvent<any[]>();
export const $transactionsList = restore(setTransactionList, []);

export const setLoaded = createEvent<boolean>();
export const $loaded = restore(setLoaded, false);

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
