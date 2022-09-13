import { call, put, takeLatest, select } from 'redux-saga/effects';
import { navigate } from '@app/shared/store/actions';
//import { ROUTES, CURRENCIES } from '@app/shared/constants';
import { selectTransactions } from '@app/shared/store/selectors';

import { actions } from '.';
import store from '../../../../index';

import { setIsLoaded } from '@app/shared/store/actions';
import { selectSystemState } from '@app/shared/store/selectors';
import { RateResponse } from '../interfaces';
import { Balance, Currency } from '@app/core/types';
import { CURRENCIES, ethId } from '@app/shared/constants';
import MetaMaskController  from '@core/MetaMask';

const metaMaskController = MetaMaskController.getInstance();

const FETCH_INTERVAL = 310000;
const API_URL = 'https://api.coingecko.com/api/v3/simple/price';
const RATE_PARAMS = 'ids=beam&vs_currencies=usd';

async function callLoadEthBalance(account: string) {
  return await metaMaskController.loadEthBalance(account);
}

async function callLoadTokenBalance(curr: Currency, account: string) {
  return await metaMaskController.loadTokenBalance(curr, account);
}

async function callLoadAllowance(curr: Currency, account: string) {
  return await metaMaskController.loadAllowance(curr, account);
}

export function* loadParamsSaga(
    action: ReturnType<typeof actions.loadAppParams.request>,
  ) : Generator {
    console.log('started')
    const systemState = (yield select(selectSystemState())) as {account: string};
    let balances: Balance[] = [];
    let balanceValue = 0;
    let isAllowed = false;
    for(let curr of CURRENCIES) {
      if (curr.id === ethId) {
        balanceValue = (yield call(callLoadEthBalance, systemState.account)) as number;
        isAllowed = true;
      } else {
        balanceValue = (yield call(callLoadTokenBalance, curr, systemState.account)) as number;
        isAllowed = (yield call(callLoadAllowance, curr, systemState.account)) as boolean;
      }
      
      balances.push({
        curr_id: curr.id,
        icon: curr.name.toLowerCase(),
        rate_id: curr.rate_id,
        value: balanceValue,
        is_approved: isAllowed
      });
    }

    yield put(actions.loadAppParams.success(balances));
}

async function loadRatesApiCall(rate_ids) {
  const response = await fetch(`${API_URL}?ids=${rate_ids.join(',')}&vs_currencies=usd`);
  const promise = await response.json();
  return promise;
}

export function* loadRate() {
  try {
    let rate_ids = [];
    for (let curr of CURRENCIES) {
      rate_ids.push(curr.rate_id);
    }
    const result = yield call(loadRatesApiCall, rate_ids);

    yield put(actions.loadRate.success(result));
    setTimeout(() => store.dispatch(actions.loadRate.request()), FETCH_INTERVAL);
  } catch (e) {
    yield put(actions.loadRate.failure(e));
  }
}

function* mainSaga() {
    yield takeLatest(actions.loadAppParams.request, loadParamsSaga);
    yield takeLatest(actions.loadRate.request, loadRate);
}

export default mainSaga;
