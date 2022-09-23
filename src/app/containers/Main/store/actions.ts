import { createAsyncAction, createAction } from 'typesafe-actions';
import { BridgeTransaction } from '@core/types';

export const setBridgeTransactions = createAction('@@MAIN/SET_BRIDGE_TRANSACTIONS')<BridgeTransaction[]>();
export const setIsLoggedIn = createAction('@@MAIN/SET_IS_LOGGED_IN')<boolean>();
export const setDonatedBeam = createAction('@@MAIN/SET_DONATED_BEAM')<number>();
export const setDonatedBeamx = createAction('@@MAIN/SET_DONATED_BEAMX')<number>();
export const setIsInProgress = createAction('@@MAIN/SET_IS_IN_PROGRESS')<boolean>();
export const setIsLocked = createAction('@@MAIN/SET_IS_LOCKED')<boolean>();
export const setIsTrInProgress = createAction('@@MAIN/SET_IS_TR_IN_PROGRESS')<boolean>();
export const setIsApproveInProgress = createAction('@@MAIN/SET_IS_APPROVE_IN_PROGRESS')<boolean>();

export const setPopupState = createAction('@@MAIN/SET_POPUP_STATE')<{type: string, state: boolean}>();

export const loadAppParams = createAsyncAction(
    '@@MAIN/LOAD_PARAMS',
    '@@MAIN/LOAD_PARAMS_SUCCESS',
    '@@MAIN/LOAD_PARAMS_FAILURE',
)<any, any, any>();

export const loadRate = createAsyncAction(
    '@@MAIN/GET_RATE',
    '@@MAIN/GET_RATE_SUCCESS',
    '@@MAIN/GET_RATE_FAILURE',
  )<void, any, any>();


