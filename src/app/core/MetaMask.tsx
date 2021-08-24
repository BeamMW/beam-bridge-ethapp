import MetaMaskOnboarding from '@metamask/onboarding';
import { 
  View, setView,
  setAccounts,
  setEthBalance,
  setUsdtBalance, setIncome
} from './../state/shared';
import { ethers } from 'ethers';
import PipeUserContract from './../../contract-pipes/eth-pipe/PipeUser.json';
import PipeUserContractIncome from './../../contract-pipes/eth-pipe/PipeUserIncome.json';
import { isNil } from './utils';

let abi = require("human-standard-token-abi");

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
      const ethBalance = await this.ethers.getBalance(this.accounts[0]);
      const formattedEthBalance = Number(ethers.utils.formatEther(ethBalance)).toFixed(2);
      setEthBalance(parseFloat(formattedEthBalance));

      const token = new ethers.Contract(ethTokenContract, abi, this.ethers);
      console.log('decimals:', await token.decimals())
      const usdtBalance = await token.balanceOf(this.accounts[0]);
      setUsdtBalance(parseFloat(ethers.utils.formatUnits(usdtBalance, 8)));
      
      this.loadIncoming();
    } else {
      //setTimeout(() => {this.loadAccounts()}, 3000);
    }
  }

  async sendToken(amount: number, pKey: string) {
    const finalAmount = amount * Math.pow(10, 8);
    const tokenContract = new ethers.Contract(
      ethTokenContract,  
      abi,
      this.ethers
    );
    const pipeUserContract = new ethers.Contract(
      ethPipeUserContract,  
      PipeUserContract.abi,
      this.ethers
    );

    const ethSigner = tokenContract.connect(this.signer);
    const approveTx = await ethSigner.approve(ethPipeUserContract, finalAmount);
    await approveTx.wait();
    // tokenContract.functions;
    if (pKey.slice(0, 2) !== '0x') {
      pKey = '0x' + pKey;
    }

    const userSigner = pipeUserContract.connect(this.signer);
    const lockTx = await userSigner.sendFunds(finalAmount, pKey);
    const receipt = await lockTx.wait();

    console.log('receipt: ', receipt);

    this.refresh();
    setView(View.BALANCE);
  }

  async receiveToken(msgId: number) {
      const pipeUserContract = new ethers.Contract(
        ethPipeUserContract,
        PipeUserContract.abi,
        this.ethers
      );
      const userSigner = pipeUserContract.connect(this.signer);
      const receiveTx = await userSigner.receiveFunds(msgId);
      await receiveTx.wait();
      this.refresh();
  }

  private async loadIncoming() {
    const pipeUserContract = new ethers.Contract(
      ethPipeUserContract,
      PipeUserContractIncome.abi,
      this.ethers  
    );
    const result = await pipeUserContract.functions.viewIncoming({from: this.accounts[0]});
    let formattedResult = [];
    if (result) {
      for (let i = 0; i < result[0].length; i++) {
        const amount = parseFloat(ethers.utils.formatUnits(result[1][i], 8));
        formattedResult.push({pid: i, id: result[0][i], amount: amount, status: ''}); 
      }
    }
    setIncome(formattedResult);
  }
}