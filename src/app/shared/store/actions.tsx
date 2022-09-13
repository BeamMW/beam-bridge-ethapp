import { createAction } from 'typesafe-actions';
import { SharedActionTypes } from './constants';

export const navigate = createAction(SharedActionTypes.NAVIGATE)<string>();
export const setError = createAction(SharedActionTypes.SET_ERROR)<string | null>();

export const setAccountState = createAction('@@SHARED/SET_ACCOUNT_STATE')<string>();
export const setNetworkState = createAction('@@SHARED/SET_NETWORK_STATE')<string>();

//export const setTransactions = createAction('@@TRANSACTIONS/SET_TRANSACTIONS')<Transaction[]>();
export const setIsLoaded = createAction('@@SHARED/SET_IS_LOADED')<boolean>();