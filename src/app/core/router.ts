import React, { useEffect } from 'react';
import { $view, View } from '@state/shared';
import { Connect, Balance, Send, Receive, Loader } from '@pages/main';

const ROUTES = {
  [View.CONNECT]: Connect,
  [View.BALANCE]: Balance,
  [View.SEND]: Send,
  [View.RECEIVE]: Receive,
  [View.LOADER]: Loader
};

export const getCurrentView = (view: View) => {
  return ROUTES[view];
};
