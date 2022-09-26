import {
  call, take, fork, takeLatest, put, select
} from 'redux-saga/effects';

import { eventChannel, END } from 'redux-saga';
import { actions as mainActions } from '@app/containers/Main/store/index';
import { navigate, setAccountState, setNetworkState } from '@app/shared/store/actions';
import store from '../../../index';

import { actions } from '@app/shared/store/index';
import { ROUTES, CURRENCIES, ethId } from '@app/shared/constants';
import MetaMaskController from '@core/MetaMask';
import MetaMaskOnboarding from '@metamask/onboarding';
import { setIsLocked, setIsLoggedIn, setPopupState } from '@app/containers/Main/store/actions';

const metaMaskController = MetaMaskController.getInstance();

const GOERLI_CHAIN_ID = '5';
//window.ethereum.networkVersion === '5'

function isNeededChain(chainId:string) {
  return chainId &&
    chainId.toLowerCase() === GOERLI_CHAIN_ID.toLowerCase();
}

function initApp(account: string) {
  store.dispatch(setAccountState(account));
  store.dispatch(setIsLoggedIn(true));
  metaMaskController.init();
  store.dispatch(mainActions.loadAppParams.request(null));
  store.dispatch(mainActions.loadRate.request());
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
    } else {
      setTimeout(()=>emitter({event: 'metamask_not_installed'}), 0)
    }

    const unsubscribe = () => {
      emitter(END);
    };

    return unsubscribe;
  });
}


export function* handleTransactions(payload) {
  let result = [];
  for (var item of CURRENCIES) {
    if (item.id !== ethId) {
      const trs = yield call(metaMaskController.loadTransactions, payload, item.ethTokenContract);
      result = result.concat(trs);
    }
  }
  yield put(actions.setTransactions(result));
}

function* sharedSaga() {
  const remoteChannel = yield call(remoteEventChannel);

  while (true) {
    try {
      const payload: any = yield take(remoteChannel);
      if (localStorage.getItem('locked')) {
        store.dispatch(setIsLocked(true));
      }

      switch (payload.event) {
        case 'account_loaded':
          if (payload.data.length === 0) {
            store.dispatch(setIsLoggedIn(false));
            const wasReloaded = localStorage.getItem('wasReloaded');
            if (wasReloaded) {
              metaMaskController.connect();
              localStorage.removeItem('wasReloaded');
            }
            yield put(navigate(ROUTES.MAIN.CONNECT));
          } else {
            initApp(payload.data[0]);
            yield fork(handleTransactions, payload.data[0]);
          }

          break;
        
        case 'account_changed':
          if (payload.data.length === 0) {
            store.dispatch(setIsLoggedIn(false));
            yield put(navigate(ROUTES.MAIN.CONNECT));
          } else {
            initApp(payload.data[0]);
            yield fork(handleTransactions, payload.data[0]);
            yield put(navigate(ROUTES.MAIN.BASE));
          }

          break;
        case 'metamask_not_installed':
          store.dispatch(setIsLoggedIn(false));
          store.dispatch(setPopupState({type: 'install', state: true}));
          yield put(navigate(ROUTES.MAIN.CONNECT));

          break;
        default:
          break;
      }
    } catch (err) {
      remoteChannel.close();
    }
  }
}

export default sharedSaga;
