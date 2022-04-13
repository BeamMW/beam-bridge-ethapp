import { createEvent, restore, createEffect } from 'effector';
import { Balance, State, AccountState } from '@core/types';
import { currencies, ethId } from '@consts/common';
import MetaMaskController  from '@core/MetaMask';
import { ROUTES } from '@app/shared/consts';

const metaMaskController = MetaMaskController.getInstance();

const API_URL = 'https://masternet-explorer.beam.mw/bridges/';
const RATE_API_URL = 'https://api.coingecko.com/api/v3/simple/price';

export enum View {
  LOADED,
  LOADING
}

export const remoteEvent = createEvent<any>();

remoteEvent.watch((args) => {
  if (args[0]) {
    setAccounts(args[0]);
  } else {
    setAccounts('');
    setView(ROUTES.CONNECT);
  }
});

export const setView = createEvent<string>();
export const $view = restore(setView, '/send');

export const setAccounts = createEvent<string>();
export const $accounts = restore(setAccounts, '');

export const setNetwork = createEvent<boolean>();
export const $isNetworkCorrect = restore(setNetwork, true);

const getTransations = async (address) => {
  let result = [];
  for (var item of currencies) {
    if (item.id !== ethId) {
      const trs = await fetch(`${API_URL}tokens_transfer/${address}/${item.ethTokenContract}`)
      result = result.concat(await trs.json());
    }
  }
  console.log(result);
  setTransactionList(result);
}

const toHex = (bytes) => {
    return bytes.map(function (b) {
        return b.toString(16)
    }).join('');
}

var appShader: Uint8Array = null;

const callAppShader = async (shaderArgs: string, createTx: Boolean = false) => {
    const sendAppShader: boolean = true;//appShader == null;
    if (sendAppShader) {
        const response = await fetch("./app.wasm");
        appShader = new Uint8Array(await response.arrayBuffer())
    }
    
    //console.log(bytes);
    
    const { ethereum } = window;

    if (createTx) {
        let enc = new TextEncoder();
        console.log(shaderArgs);
        const arr = enc.encode(shaderArgs);
        console.log(arr);
        const data = '0x' + toHex(Array.from(arr));
        console.log(data);
        const transactionParameters = {
            //nonce: '0x00', // ignored by MetaMask
            gasPrice: '0x3b9aca00', // customizable by user during MetaMask confirmation.
            gas: '0x5208', // customizable by user during MetaMask confirmation.
            to: '0x0000000000000000000000000000000000000000', // Required except during contract publications.
            from: ethereum.selectedAddress, // must match user's active address.
            value: '0x00', // Only required to send ether to the recipient from the initiating external account.
            data: data,
            //'0x7f7465737432000000000000000000000000000000000000000000000000000000600057', // Optional, but used for defining smart contract creation and interaction.
            //chainId: '0x3', // Used to prevent transaction reuse across blockchains. Auto-filled by MetaMask.
        };

        // txHash is a hex string
        // As with any RPC call, it may throw an error
        const txHash = await ethereum.request({
            method: 'eth_sendTransaction',
            params: [transactionParameters],
        });
        return {};
    }

    let request = {
        jsonrpc: '2.0',
        id: 1,
        method: 'invoke_contract',
        params:
        {
            args: shaderArgs,
            create_tx: createTx
        }
    };

    if (sendAppShader) {
        const bytes = Array.from(appShader);
        request.params['contract'] = bytes;
    }

    const state = JSON.parse(await ethereum.request({
        method: 'eth_call',
        params: [
            {
                data: JSON.stringify(request)
            },
            'latest'
        ]
    }));
    console.log(state);
    console.log(state.result.output);
    return JSON.parse(state.result.output);
}

const contractID: string = '38a60c284e4c81f9c09e6a5b042ca4654730c6717768edada343bca4bf8cbdd7';
//const contractID: string = 'b09361e57d42ddad63dc06ce94706f82e11ad90cd63fa0d3dd7913e9edd9b902';

const getState = async () => {
    const state = await callAppShader(`role=user,action=view_state,cid=${contractID}`);
    console.log(state);
    setState(state);
}

const getAccountState = async () => {
    const { ethereum } = window;
    const state = await callAppShader(`role=user,action=view_account,accountID=${ethereum.selectedAddress.slice(-40)},cid=${contractID}`);
    console.log(state);
    if ('error' in state) {
        setAccountState('not voted');
    } else {
        setAccountState(state.impression);
    }
}

export const likeDislike = async (like: boolean) => {
    const { ethereum } = window;
    const action = like ? 'like' : 'dislike';
    await callAppShader(`role=user,action=${action},accountID=${ethereum.selectedAddress.slice(-40)},cid=${contractID}`, true);
}

const getBalances = async (address: string) => {
  let balances: Balance[] = [];
  let balanceValue = 0;
  let isAllowed = false;
  for(let curr of currencies) {
    if (curr.id === ethId) {
      balanceValue = await metaMaskController.loadEthBalance(address);
      isAllowed = true;
    } else {
      balanceValue = 14004; //await metaMaskController.loadTokenBalance(curr, address);
      isAllowed = true;//await metaMaskController.loadAllowance(curr, address);
    }
    
    balances.push({
      curr_id: curr.id,
      icon: curr.name.toLowerCase(),
      rate_id: curr.rate_id,
      value: balanceValue,
      is_approved: isAllowed
    });
  }

  setBalance(balances);
} 

$accounts.watch(async (account) => {
    await getState();
    await getAccountState();
  if (account.length > 0) {
    await getBalances(account);
      await getTransations(account);
      await getState();
    setInterval(async () => {
      await getBalances(account);
        await getTransations(account);
        await getState();
        await getAccountState();
    }, 5000)
  }
})

export const setBalance = createEvent<Balance[]>();
export const $balance = restore(setBalance, []);

export const setState = createEvent<State>();
export const $state = restore(setState, { likes: 0, dislikes: 0 });

export const setAccountState = createEvent<AccountState>();
export const $accountState = restore(setAccountState, 'not voted');

export const setIsInProgress = createEvent<boolean>();
export const $isInProgress = restore(setIsInProgress, false);

export const setIncome = createEvent<{id: number, amount: number}[]>();
export const $income = restore(setIncome, null);

const setTransactionList = createEvent<any[]>();
export const $transactionsList = restore(setTransactionList, []);

export const setLoaded = createEvent<boolean>();
export const $loaded = restore(setLoaded, false);

export const getRateFx = createEffect(async () => {
  let rate_ids = [];
  for (let curr of currencies) {
    rate_ids.push(curr.rate_id);
  }
  const response = await fetch(`${RATE_API_URL}?ids=${rate_ids.join(',')}&vs_currencies=usd`, {
    mode: 'cors',
    headers: {
      'Access-Control-Allow-Origin':'*'
    }
  });
  const promise: Promise<any> = response.json();
  return promise;
});

export const $rate = restore(
  getRateFx.doneData.map((data) => {
    console.log(data);
    return data;
  }), null,
);

getRateFx.doneData.watch(() => setTimeout(getRateFx, 60000));
