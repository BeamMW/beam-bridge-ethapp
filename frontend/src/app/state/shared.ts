import { createEvent, restore } from 'effector';

export enum View {
  CONNECT,
  BALANCE,
  SEND,
}

export const setView = createEvent<View>();
export const $view = restore(setView, View.CONNECT);

export const setAccounts = createEvent<boolean>();
export const $accounts = restore(setAccounts, null);
