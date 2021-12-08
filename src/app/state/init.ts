import { sample } from 'effector';
import MetaMaskOnboarding from '@metamask/onboarding';
import React from 'react';
import { 
    View, setView, 
    setAccounts, $accounts
} from './shared';
import MetaMaskController  from '@core/MetaMask';
import { isNil } from '@core/utils';
import { SendParams } from '@core/types';

const metaMaskController = MetaMaskController.getInstance();
let interval = null;
export async function initApp() {
    metaMaskController.init();
    if (isNil(interval)) {
        interval = setInterval(() => { metaMaskController.refresh() }, 3000);
    }
}

export function connectToMetaMask() {
    metaMaskController.connect();
    if (isNil(interval)) {
        interval = setInterval(() => { metaMaskController.refresh() }, 3000);
    }
}

export async function getBalance() {
    //return metaMaskController.getBalance();
}

export async function send(params: SendParams) {
    metaMaskController.sendToken(params);
}

export async function receive(id: number) {
    metaMaskController.receiveToken(id);
}