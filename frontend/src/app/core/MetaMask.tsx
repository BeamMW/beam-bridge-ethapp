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
      this.getBalance();
      this.loadIncoming();
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

  
  private async getBalance() {
    const accounts = await this.web3.eth.getAccounts();
    const balance: number = await this.web3.eth.getBalance(accounts[0]);
    setEthBalance(balance);

    const contractAddress = "0x53d84F758276357DA72bF18Cc5b33D31AEc0BACD";

    const token = new this.web3.eth.Contract(abi, contractAddress);
    const tokenBalance = await token.methods.balanceOf(accounts[0]).call();
    setUsdtBalance(tokenBalance);
  }

  private async loadIncoming() {
    const pipeUserContract = new this.web3.eth.Contract(
        PipeUserContractIncome.abi,
        '0x81a9405EeecDACd5EB328E5C79bcA280eDb61cc1'
    );

    const result = await pipeUserContract.methods.viewIncoming().call();
    
    let formattedResult = [];
    if (result) {
      for (let i = 0; i < result[0].length; i++) {
        formattedResult.push({pid: i, id: result[0][i], amount: result[1][i], status: ''}); 
      }
    }
    setIncome(formattedResult);
  }
}