import {
  call, take, fork, takeLatest, put, select
} from 'redux-saga/effects';

import { eventChannel, END } from 'redux-saga';
import { actions } from '@app/shared/store/index';
import { actions as mainActions } from '@app/containers/Main/store/index';
import { navigate, setAccountState, setNetworkState } from '@app/shared/store/actions';
import store from '../../../index';
import { SharedStateType } from '../interface';
import { FaucetStateType } from '@app/containers/Main/interfaces';

import { ROUTES } from '@app/shared/constants';
import MetaMaskController from '@core/MetaMask';

import MetaMaskOnboarding from '@metamask/onboarding';

const metaMaskController = MetaMaskController.getInstance();

const GOERLI_CHAIN_ID = '5';
//window.ethereum.networkVersion === '5'

function isNeededChain(chainId:string) {
  return chainId &&
    chainId.toLowerCase() === GOERLI_CHAIN_ID.toLowerCase();
}

function connectMetaMask () {
  // Request to connect to the MetaMask wallet
  window.ethereum
    .request({ method: 'eth_requestAccounts' })
    .then(accounts => this.setState({ accounts }))
}

export function remoteEventChannel() {
  return eventChannel((emitter) => {
    //emitter(true)
    // if (MetaMaskOnboarding.isMetaMaskInstalled()) {
    //   if (this.state.accounts.length > 0) {
    //     // If the user is connected to MetaMask, stop the onboarding process.
    //     this.state.onboarding.stopOnboarding()
    //   }
    // }

    // if (!MetaMaskOnboarding.isMetaMaskInstalled()) {
    
    // } else if (this.state.accounts.length === 0) {
    
    // }  else if (!isNeededChain(this.state.chainId)) {
    // }
    if (MetaMaskOnboarding.isMetaMaskInstalled()) {
      window.ethereum
        .request({ method: 'eth_accounts' })
        .then(accounts => emitter({event: 'account_loaded', data: accounts}));

      window.ethereum.on('accountsChanged', accounts => emitter({event: 'account_changed', data: accounts}));

      window.ethereum.on('chainChanged', () => emitter({event: 'chain_changed'})); //window.location.reload());

      window.ethereum.on('connect', (connectInfo) => {
        //const chainId = connectInfo.chainId;
        emitter({event: 'connected_chain', data: connectInfo})
        //this.setState({ chainId })
        // if (isAvalancheChain(chainId)) {
        //   this.props.onConnected()
        // }
      })
    }

    const unsubscribe = () => {
      emitter(END);
    };

    return unsubscribe;
  });
}


export function* handleTransactions(payload) {
  //yield put(actions.setTransactions(payload.txs));
}

function* sharedSaga() {
  const remoteChannel = yield call(remoteEventChannel);

  while (true) {
    try {
      const payload: any = yield take(remoteChannel);
      console.log('payload: ', payload);
      switch (payload.event) {
        case 'account_loaded':
          if (payload.data.length === 0) {
            yield put(navigate(ROUTES.MAIN.CONNECT));
          } else {
            store.dispatch(setAccountState(payload.data[0]));
            metaMaskController.init();
            store.dispatch(mainActions.loadAppParams.request(null));

            store.dispatch(mainActions.loadRate.request());
            //yield put(navigate(ROUTES.MAIN.BASE));
          }

          break;
        
        case 'account_changed':
          if (payload.data.length === 0) {
            yield put(navigate(ROUTES.MAIN.CONNECT));
          } else {
            store.dispatch(setAccountState(payload.data[0]));
            metaMaskController.init();
            store.dispatch(mainActions.loadAppParams.request(null));

            store.dispatch(mainActions.loadRate.request());
            //yield put(navigate(ROUTES.MAIN.BASE));
          }

        default:
          break;
      }
    } catch (err) {
      remoteChannel.close();
    }
  }
}

export default sharedSaga;
