import MetaMaskOnboarding from '@metamask/onboarding';
import { 
  View, setView,
  setAccounts,
  setIsInProgress, setBalance,
  remoteEvent
} from './../state/shared';
import { ethers, BigNumber } from 'ethers';
import EthPipe from './../../contract-pipes/eth-pipe/EthPipe.json';
import EthERC20Pipe from './../../contract-pipes/eth-pipe/EthERC20Pipe.json';
import { SendParams, Balance, Currency } from '@core/types';
import { currencies, ethId } from '@consts/common';
import { MAX_ALLOWED_VALUE, REVOKE_VALUE } from '@consts/common';
import { ROUTES } from '@consts/routes';

const API_URL = 'https://api.coingecko.com/api/v3/simple/price';

let abi = require("human-standard-token-abi");

declare global {
    interface Window {
        ethereum: any;
    }
}

export default class MetaMaskController {
  private onboarding = new MetaMaskOnboarding();

  private static instance: MetaMaskController;
  private accounts = [];
  private ethers = null;
  private signer = null;

  static getInstance() {
    if (this.instance != null) {
      return this.instance;
    }
    this.instance = new MetaMaskController();
    return this.instance;
  }

  constructor() {}

  private loadAccounts() {
    console.log('loadAccounts called')
    window.ethereum
      .request({ method: 'eth_accounts' })
      .then(remoteEvent);
  }

  async loadEthBalance(address: string) {
    const ethBalance = await this.ethers.getBalance(address);
    return parseFloat(Number(ethers.utils.formatEther(ethBalance)).toFixed(2))
  }

  async loadTokenBalance(curr: Currency, address: string) {
    const token = new ethers.Contract(curr.ethTokenContract, abi, this.ethers);
    const tokenBalance = await token.balanceOf(address);
    const tokenBalanceFormatted = parseFloat(ethers.utils.formatUnits(tokenBalance, curr.decimals));
    return tokenBalanceFormatted
  }

  init() {
    console.log('init called')
    if (MetaMaskOnboarding.isMetaMaskInstalled()) {
      this.ethers = new ethers.providers.Web3Provider(window.ethereum);
      this.signer = this.ethers.getSigner();
      window.ethereum.on('accountsChanged', ()=>{this.loadAccounts()});
      this.loadAccounts();
    }
  }

  connect() {
    console.log('connect called')
    if(MetaMaskOnboarding.isMetaMaskInstalled()) {
      window.ethereum
        .request({ method: 'eth_requestAccounts' });
    } else {
      this.onboarding.startOnboarding();
    }
  }

  disconnect() {

  }

  requestToContract = async (sender, receiver, abi) => {
    let nonce = await this.ethers.getTransactionCount(sender);
    let hashTx = await this.ethers.sendTransaction({
        from: sender,
        to: receiver,
        data: abi,
        gas: 2000000,
        nonce: nonce,
    });

    console.log('hash tx: ', hashTx);
  }

  async refresh() {
    const isUnlocked = await window.ethereum._metamask.isUnlocked();

    if (isUnlocked && this.accounts.length > 0) {
      
    }
  }

  async loadAllowance(curr: Currency, address: string) {
    const tokenContract = new ethers.Contract(
      curr.ethTokenContract,  
      abi,
      this.ethers
    );

    const allowance = await tokenContract.allowance(address, curr.ethPipeContract);
    return parseFloat(ethers.utils.formatUnits(allowance)) > 0; //is Allowed
  }

  static amountToBigInt(amount, decimals, validDecimals: number) : bigint {
    let result = BigInt(Math.round(amount * Math.pow(10, validDecimals)));

    return result * BigInt(Math.pow(10, decimals - validDecimals));
  }

  async sendToken(params: SendParams) {
    const { amount, fee, address, selectedCurrency, account } = params;
    const finalAmount = MetaMaskController.amountToBigInt(amount, selectedCurrency.decimals, selectedCurrency.validator_dec);
    const relayerFee = MetaMaskController.amountToBigInt(fee, selectedCurrency.decimals, selectedCurrency.validator_dec);
    const totalAmount = finalAmount + relayerFee;

    // TODO should delete this code. it's only for debug
    console.log('amount = ', amount, ' fee = ', fee);
    console.log('finalAmount = ', finalAmount, ' relayerFee = ', relayerFee, ' totalAmount = ', totalAmount);

    setIsInProgress(true);

    try {
      if (selectedCurrency.id === ethId) {
        //send for eth
        const pipeContract = new ethers.Contract(
          selectedCurrency.ethPipeContract,
          EthPipe.abi,
          this.ethers
        );

        const userSigner = pipeContract.connect(this.signer);
        const lockTx = await userSigner.sendFunds(
          finalAmount,
          relayerFee,
          address.slice(0, 2) !== '0x' ? ('0x' + address) : address,
          {
            from: account,
            value: totalAmount
          }
        );
        
        await lockTx.wait().then((receipt)=> {
          setIsInProgress(false);
          console.log('receipt: ', receipt);
        });
      } else {
        const pipeContract = new ethers.Contract(
          selectedCurrency.ethPipeContract,  
          EthERC20Pipe.abi,
          this.ethers
        );
        
        const userSigner = pipeContract.connect(this.signer);
        const lockTx = await userSigner.sendFunds(
          finalAmount,
          relayerFee,
          address.slice(0, 2) !== '0x' ? ('0x' + address) : address
        );

        await lockTx.wait().then((receipt)=> {
          setIsInProgress(false);
          console.log('receipt: ', receipt);
        });
      }
    } catch (e) {
      console.log('send transaction error: ', e);
      setIsInProgress(false);
    }

    this.refresh();
    setView(ROUTES.BASE);
  }

  async updateTokenSendLimit(curr_id: number, amount: any) {
    const currency = currencies.find((item) => item.id === curr_id);
    const tokenContract = new ethers.Contract(
      currency.ethTokenContract,  
      abi,
      this.ethers
    );

    const ethSigner = tokenContract.connect(this.signer);
    const approveTx = await ethSigner.approve(currency.ethPipeContract, amount);
    await approveTx.wait();
  }

  async approveToken(curr_id: number) {
    this.updateTokenSendLimit(curr_id, MAX_ALLOWED_VALUE);
  }

  async revokeToken(curr_id: number) {
    console.log(BigNumber.from(REVOKE_VALUE));
    this.updateTokenSendLimit(curr_id, BigNumber.from(REVOKE_VALUE));
  }

  async receiveToken(msgId: number) {
    // TODO: remove all mentions of the 'receiveToken'
  }

  // TODO: implement depending on the type of token
  async getTokenDecimals() {
    return 8;
  }

  async loadGasPrice () {
    const gasPrice = ethers.utils.formatUnits(await this.ethers.getGasPrice(), 'gwei');
    console.log('gas price:', gasPrice);
    return gasPrice;
  }

  async loadRate (rate_id: string) {
    const response = await fetch(`${API_URL}?ids=${rate_id}&vs_currencies=usd`, {
      mode: 'cors',
      headers: {
        'Access-Control-Allow-Origin':'*'
      }
    });
    const promise: Promise<any> = response.json();
    return promise;
  }

  async calcSomeFee (rate_id: string) {
    const RELAY_COSTS_IN_GAS = 120000;
    const ETH_RATE_ID = 'ethereum';

    const gasPrice = await this.loadGasPrice();
    const ethRate = await this.loadRate(ETH_RATE_ID)
    const relayCosts = RELAY_COSTS_IN_GAS * parseFloat(gasPrice) * parseFloat(ethRate[ETH_RATE_ID]['usd']) / Math.pow(10, 9);
    const currRate = await this.loadRate(rate_id);

    const RELAY_SAFETY_COEFF = 1.1;
    return RELAY_SAFETY_COEFF * relayCosts / parseFloat(currRate[rate_id]['usd']);
  }
}