import React, { useState } from 'react';
import MetaMaskOnboarding from '@metamask/onboarding';
import { 
  View, setView, 
  setAccounts,
  setEthBalance,
  setUsdtBalance, setIncome
} from './../state/shared';
let abi = require("human-standard-token-abi");
import PipeUserContract from './../../contract-pipes/eth-pipe/PipeUser.json';
import BeamTokenContract from './../../contract-pipes/eth-pipe/PipeBeam.json';
import PipeUserContractIncome from './../../contract-pipes/eth-pipe/PipeUserIncome.json';

declare global {
    interface Window {
        ethereum: any;
    }
}

const ethTokenContract = '0x53d84F758276357DA72bF18Cc5b33D31AEc0BACD';
const ethPipeUserContract = '0x81a9405EeecDACd5EB328E5C79bcA280eDb61cc1';

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

  constructor() {}

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
      this.refresh();
    }
  }

  connect() {
    if(MetaMaskOnboarding.isMetaMaskInstalled()) {
      window.ethereum
        .request({ method: 'eth_requestAccounts' });
      window.ethereum.on('accountsChanged', this.handleAccounts);
    } else {
      this.onboarding.startOnboarding();
    }
  }

  private async refresh() {
    this.getBalance();
    this.loadIncoming();
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
    const finalAmount = amount * Math.pow(10, 8);
    const tokenContract = new this.web3.eth.Contract(
        abi,
        ethTokenContract
    );
    const pipeUserContract = new this.web3.eth.Contract(
        PipeUserContract.abi,
        ethPipeUserContract
    );
    const approveTx = tokenContract.methods.approve(ethPipeUserContract, finalAmount);
    if (pKey.slice(0, 2) !== '0x') {
      pKey = '0x' + pKey;
    }
    const lockTx = pipeUserContract.methods.sendFunds(finalAmount, pKey);
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

    this.refresh();
    setView(View.BALANCE);
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

  
  private async getBalance() {
    const accounts = await this.web3.eth.getAccounts();
    const balance: number = await this.web3.eth.getBalance(accounts[0]);
    setEthBalance(balance);

    const token = new this.web3.eth.Contract(abi, ethTokenContract);
    const tokenBalance = await token.methods.balanceOf(accounts[0]).call();
    setUsdtBalance(tokenBalance);
  }

  private async loadIncoming() {
    const pipeUserContract = new this.web3.eth.Contract(
        PipeUserContractIncome.abi,
        ethPipeUserContract
    );
    const accounts = await this.web3.eth.getAccounts();
    const result = await pipeUserContract.methods.viewIncoming().call({from: accounts[0]});
    
    let formattedResult = [];
    if (result) {
      for (let i = 0; i < result[0].length; i++) {
        formattedResult.push({pid: i, id: result[0][i], amount: result[1][i], status: ''}); 
      }
    }
    setIncome(formattedResult);
  }
}