import { sample } from 'effector';
import MetaMaskOnboarding from '@metamask/onboarding';
import React from 'react';
import { View, setView, setAccounts, $accounts } from './shared';
import MetaMaskController  from '@core/MetaMask';
import { isNil } from '@core/utils';

const metaMaskController = MetaMaskController.getInstance();

export async function initApp() {
    metaMaskController.init();
    metaMaskController.getBalance();
    $accounts.watch(value => {
        if (!isNil(value) && value.length > 0) {
            setView(View.BALANCE);
        } else {
            setView(View.CONNECT);
        }
    });
}

export function connectToMetaMask() {
    metaMaskController.connect(); 
}

export async function getBalance() {
    //return metaMaskController.getBalance();
}

export async function send(address: string, amount: number) {
    metaMaskController.sendToken(amount, address);
}