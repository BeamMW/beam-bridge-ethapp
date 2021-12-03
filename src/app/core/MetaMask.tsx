import MetaMaskOnboarding from '@metamask/onboarding';
import { 
  View, setView,
  setAccounts,
  setIsInProgress, setBalance
} from './../state/shared';
import { ethers } from 'ethers';
import EthPipe from './../../contract-pipes/eth-pipe/EthPipe.json';
import EthERC20Pipe from './../../contract-pipes/eth-pipe/EthERC20Pipe.json';
import { isNil } from './utils';
import { SendParams, ethId, currencies, Currency, Balance } from '@core/types';

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

  handleAccounts(accounts) {
    setAccounts(accounts);
    if (accounts.length > 0) {
      this.accounts = accounts;
    }
  }

  private loadAccounts() {
    console.log('loadAccounts called')
    window.ethereum
      .request({ method: 'eth_accounts' })
      .then((accounts) => {
        if (accounts.length > 0) {
          this.handleAccounts(accounts);
          this.refresh();
        } else {
          this.handleAccounts([]);
        }
    });
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
      let balances: Balance[] = [];
      for(let curr of currencies) {
        if (curr.id === ethId) {
          const ethBalance = await this.ethers.getBalance(this.accounts[0]);
          const formattedEthBalance = Number(ethers.utils.formatEther(ethBalance)).toFixed(2);
          balances.push({
            curr_id: ethId,
            icon: curr.name,
            value: parseFloat(formattedEthBalance)
          });
        } else {
          try {
            const token = new ethers.Contract(curr.ethTokenContract, abi, this.ethers);
            const tokenBalance = await token.balanceOf(this.accounts[0]);
            balances.push({
              curr_id: curr.id,
              icon: curr.name,
              value: parseFloat(ethers.utils.formatUnits(tokenBalance, curr.decimals))
            });
          } catch (e) {
            //console.log(e);
          }
        }
      }

      setBalance(balances);
    }
  }

  static amountToBigInt(amount: number, decimals: number) : BigInt {
    const multiplier = Math.pow(10, decimals);
    let result = BigInt(Math.trunc(amount)) * BigInt(multiplier);
    let other = Math.trunc((amount - Math.trunc(amount)) * multiplier);
    return result + BigInt(other);
  }

  async sendToken(params: SendParams) {
    const { amount, fee, address, selectedCurrency, account } = params;
    const finalAmount = MetaMaskController.amountToBigInt(amount, selectedCurrency.decimals);
    const relayerFee = MetaMaskController.amountToBigInt(fee, selectedCurrency.decimals);
    const totalAmount = finalAmount + relayerFee;

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
        const tokenContract = new ethers.Contract(
          selectedCurrency.ethTokenContract,  
          abi,
          this.ethers
        );
        const pipeContract = new ethers.Contract(
          selectedCurrency.ethPipeContract,  
          EthERC20Pipe.abi,
          this.ethers
        );

        const ethSigner = tokenContract.connect(this.signer);
        const approveTx = await ethSigner.approve(selectedCurrency.ethPipeContract, totalAmount);
        await approveTx.wait();

        // tokenContract.functions;
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
    setView(View.BALANCE);
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