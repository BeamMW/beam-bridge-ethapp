import { sample } from 'effector';
import MetaMaskOnboarding from '@metamask/onboarding';
import React from 'react';
import { View, setView, setAccounts, $accounts } from './shared';

declare global {
  interface Window {
      ethereum: any;
  }
}

export async function initApp() {
  
}
