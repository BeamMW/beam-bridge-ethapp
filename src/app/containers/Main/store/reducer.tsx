import produce from 'immer';
import { ActionType, createReducer } from 'typesafe-actions';

import { AppStateType } from '../interfaces';
import * as actions from './actions';

type Action = ActionType<typeof actions>;

const initialState: AppStateType = {
  bridgeTransactions: [],
  isLoggedIn: false,
  balance: [],
  isLocked: false,
  // appParams: {
  //   backlogPeriod: 0,
  //   enabled: 0,
  //   isAdmin: 0,
  //   withdrawLimit: 0
  // },
  popupsState: {
    account: false,
    install: false
  },
  // funds: [],
  rate: null,
  isDonateInProgress: false,
  donatedBeam: 0,
  donatedBeamX: 0
};

const reducer = createReducer<AppStateType, Action>(initialState)
  .handleAction(actions.setBridgeTransactions, (state, action) => produce(state, (nexState) => {
    nexState.bridgeTransactions = action.payload;
  }))
  .handleAction(actions.setIsLoggedIn, (state, action) => produce(state, (nexState) => {
    nexState.isLoggedIn = action.payload;
  }))
  .handleAction(actions.setIsLocked, (state, action) => produce(state, (nexState) => {
    nexState.isLocked = action.payload;
  }))
  .handleAction(actions.loadAppParams.success, (state, action) => produce(state, (nexState) => {
    nexState.balance = action.payload;
  }))
  .handleAction(actions.setPopupState, (state, action) => produce(state, (nexState) => {
    nexState.popupsState[action.payload.type] = action.payload.state;
  }))
  .handleAction(actions.loadRate.success, (state, action) => produce(state, (nexState) => {
    nexState.rate = action.payload;
  }))
  .handleAction(actions.setDonatedBeam, (state, action) => produce(state, (nexState) => {
    nexState.donatedBeam = action.payload;
  }))
  .handleAction(actions.setDonatedBeamx, (state, action) => produce(state, (nexState) => {
    nexState.donatedBeamX = action.payload;
  }))
  .handleAction(actions.setIsInProgress, (state, action) => produce(state, (nexState) => {
    nexState.isDonateInProgress = action.payload;
  }))

export { reducer as MainReducer };
