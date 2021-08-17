import React, { useState } from 'react';
import MetaMaskOnboarding from '@metamask/onboarding';
import { View, setView, setAccounts, $accounts } from './../state/shared';
let abi = require("human-standard-token-abi");
import PipeUserContract from './../../contract-pipes/eth-pipe/PipeUser.json';

declare global {
    interface Window {
        ethereum: any;
    }
}


const ethTokenContract = '0x8CdaF0CD259887258Bc13a92C0a6dA92698644C0';
const ethPipeUserContract = '0x345cA3e014Aaf5dcA488057592ee47305D9B3e10';

export default class MetaMaskController {
  private onboarding = new MetaMaskOnboarding();

  private static instance: MetaMaskController;
  private web3: Web3;

  static getInstance() {
    if (this.instance != null) {
      return this.instance;
    }
    this.instance = new MetaMaskController();
    return this.instance;
  }
  
//   React.useEffect(() => {
    
//   }, []);

//   React.useEffect(() => {
//     if (MetaMaskOnboarding.isMetaMaskInstalled()) {
//       if (accounts.length > 0) {
//         setView(View.BALANCE);
//         setButtonText(CONNECTED_TEXT);
//         setDisabled(true);
//         onboarding.current.stopOnboarding();
//       } else {
//         setButtonText(CONNECT_TEXT);
//         setDisabled(false);
//       }
//     }
//   }, [accounts]);

//   React.useEffect(() => {
//     function handleNewAccounts(newAccounts) {
//       setAccounts(newAccounts);
//     }
//     if (MetaMaskOnboarding.isMetaMaskInstalled()) {
//       window.ethereum
//         .request({ method: 'eth_requestAccounts' })
//         .then(handleNewAccounts);
//       window.ethereum.on('accountsChanged', handleNewAccounts);
//       return () => {
//         if (window.ethereum.off !== undefined) {
//           window.ethereum.off('accountsChanged', handleNewAccounts);
//         }
//       };
//     }
//   }, []);

  constructor() {
    // if (!this.onboarding.current) {
    //     this.onboarding.current = new MetaMaskOnboarding();
    // }
  }

  handleAccounts(accounts) {
    setAccounts(accounts);
  }

  init() {
    if (MetaMaskOnboarding.isMetaMaskInstalled()) {
      window.ethereum
        .request({ method: 'eth_accounts' })
        .then((accounts) => {
          if (accounts.length > 0) {
            this.handleAccounts(accounts); 
          } else {
            this.handleAccounts([]);
          }
      });
      this.web3 = new Web3(window.ethereum);
    }
  }

  connect() {
    if(MetaMaskOnboarding.isMetaMaskInstalled()) {
      window.ethereum
        .request({ method: 'eth_requestAccounts' });
    } else {
      this.onboarding.startOnboarding();
    }
  }

  requestToContract = async (sender, receiver, abi) => {
    let nonce = await this.web3.eth.getTransactionCount(sender);
    let hashTx = await this.web3.eth.sendTransaction({
        from: sender,
        to: receiver,
        data: abi,
        gas: 2000000,
        nonce: nonce,
    });

    console.log('hash tx: ', hashTx);
  }

  async sendToken(amount: number, pKey: string) {
    const tokenContract = new this.web3.eth.Contract(
        abi,
        ethTokenContract
    );
    const pipeUserContract = new this.web3.eth.Contract(
        PipeUserContract.abi,
        ethPipeUserContract
    );
    const approveTx = tokenContract.methods.approve(ethPipeUserContract, amount);
    const lockTx = pipeUserContract.methods.sendFunds(amount, pKey);
    let accounts = await this.web3.eth.getAccounts();
    

    await this.requestToContract(
        accounts[0], 
        ethTokenContract, 
        approveTx.encodeABI());
    let lockTxReceipt = await this.requestToContract(
        accounts[0], 
        ethPipeUserContract,
        lockTx.encodeABI());

    console.log('receipt: ', lockTxReceipt);
  }

  async receiveToken(msgId: number) {
      const pipeUserContract = new this.web3.eth.Contract(
          PipeUserContract.abi,
          ethPipeUserContract
      );
      const receiveTx = pipeUserContract.methods.receiveFunds(msgId);
      const accounts = await this.web3.eth.getAccounts();

      let receiveTxReceipt = await this.requestToContract(
          accounts[0], 
          ethPipeUserContract,
          receiveTx.encodeABI());

      console.log('receive receipt: ', receiveTxReceipt);
  }

  async getBalance() {
    const tokenContract = new this.web3.eth.Contract(
        abi,
        ethTokenContract
    );
    let accounts = await this.web3.eth.getAccounts();
    let balance = await this.web3.eth.getBalance(accounts[0]);
    //let tokenBalance = await tokenContract.methods.balanceOf(accounts[0]).call();
    //console.log(tokenBalance);
    console.log(balance)
    //return balance;
  }
}