import React, { useEffect } from 'react';
import { $view, View } from '@state/shared';
import { Connect, Balance, Send } from '@pages/main';

const ROUTES = {
  [View.CONNECT]: Connect,
  [View.BALANCE]: Balance,
  [View.SEND]: Send
};

export const getCurrentView = (view: View) => {
  return ROUTES[view];
};
