(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){

let abi = require("human-standard-token-abi");
const ethTokenContract = '0x8CdaF0CD259887258Bc13a92C0a6dA92698644C0';
const ethPipeUserContract = '0x345cA3e014Aaf5dcA488057592ee47305D9B3e10';

async function getBalance() {
    let accounts = await window.web3.eth.getAccounts();

    let balance = await window.web3.eth.getBalance(accounts[0]);

    // let tokenInst  =  new web3.eth.Contract(abi,
    //     ethTokenContract);


    //     tokenInst.methods.decimals().call(function(error,d){
    //         console.log("decimals:",error,d);
            
    //         //calculate actual tokens amounts based on decimals in token
    //         let tokens=web3.utils.toBN("0x"+(amount*10**d).toString(16));
        
    //     });
    document.getElementById("resultBalance").innerHTML = "balance: " + balance;

    console.log('account = ', accounts[0]);
    console.log('balance = ', balance);

    const tokenContract = new window.web3.eth.Contract(
        abi,
        ethTokenContract
    );

    let tokenBalance = await tokenContract.methods.balanceOf(accounts[0]).call();
    document.getElementById("resultBalance").innerHTML = "Ethereum balance: " + balance + "<br/>Token balance: " + tokenBalance;

    console.log("token balance: ", tokenBalance);
}

const requestToContract = async (sender, receiver, abi) => {
    let nonce = await window.web3.eth.getTransactionCount(sender);
    let hashTx = await window.web3.eth.sendTransaction({
        from: sender,
        to: receiver,
        data: abi,
        gas: 2000000,
        nonce: nonce,
    });

    console.log('hash tx: ', hashTx);
}

async function sendToken() {
    const tokenContract = new window.web3.eth.Contract(
        abi,
        ethTokenContract
    );
    const pipeUserContract = new window.web3.eth.Contract(
        PipeUserContract.abi,
        ethPipeUserContract
    );
    const sendValue = parseInt(document.getElementById("amount").value);
    const pubKey = document.getElementById("publicKey").value;
    const approveTx = tokenContract.methods.approve(ethPipeUserContract, sendValue);
    const lockTx = pipeUserContract.methods.sendFunds(sendValue, pubKey);
    let accounts = await window.web3.eth.getAccounts();
    

    await requestToContract(
        accounts[0], 
        ethTokenContract, 
        approveTx.encodeABI());
    let lockTxReceipt = await requestToContract(
        accounts[0], 
        ethPipeUserContract,
        lockTx.encodeABI());

    console.log('receipt: ', lockTxReceipt);
}

async function receiveToken() {
    const pipeUserContract = new window.web3.eth.Contract(
        PipeUserContract.abi,
        ethPipeUserContract
    );
    const msgId = parseInt(document.getElementById("msgId").value);
    const receiveTx = pipeUserContract.methods.receiveFunds(msgId);
    let accounts = await window.web3.eth.getAccounts();

    let receiveTxReceipt = await requestToContract(
        accounts[0], 
        ethPipeUserContract,
        receiveTx.encodeABI());

    console.log('receive receipt: ', receiveTxReceipt);
}

window.onload = async () => {
    // New web3 provider
    if (window.ethereum) {
        window.web3 = new Web3(window.ethereum);
        try {
            // ask user for permission
            await window.ethereum.enable();
            // user approved permission
        } catch (error) {
            // user rejected permission
            console.log('user rejected permission');
        }
    }
    // Old web3 provider
    else if (window.web3) {
        window.web3 = new Web3(web3.currentProvider);
        // no need to ask for permission
    }
    // No web3 provider
    else {
        console.log('No web3 provider detected');
    }

    document.getElementById("send").onclick = sendToken;
    document.getElementById("receive").onclick = receiveToken;
}
},{"human-standard-token-abi":2}],2:[function(require,module,exports){
module.exports = [
  {
    "constant": true,
    "inputs": [],
    "name": "name",
    "outputs": [
      {
        "name": "",
        "type": "string"
      }
    ],
    "payable": false,
    "type": "function"
  },
  {
    "constant": false,
    "inputs": [
      {
        "name": "_spender",
        "type": "address"
      },
      {
        "name": "_value",
        "type": "uint256"
      }
    ],
    "name": "approve",
    "outputs": [
      {
        "name": "success",
        "type": "bool"
      }
    ],
    "payable": false,
    "type": "function"
  },
  {
    "constant": true,
    "inputs": [],
    "name": "totalSupply",
    "outputs": [
      {
        "name": "",
        "type": "uint256"
      }
    ],
    "payable": false,
    "type": "function"
  },
  {
    "constant": false,
    "inputs": [
      {
        "name": "_from",
        "type": "address"
      },
      {
        "name": "_to",
        "type": "address"
      },
      {
        "name": "_value",
        "type": "uint256"
      }
    ],
    "name": "transferFrom",
    "outputs": [
      {
        "name": "success",
        "type": "bool"
      }
    ],
    "payable": false,
    "type": "function"
  },
  {
    "constant": true,
    "inputs": [],
    "name": "decimals",
    "outputs": [
      {
        "name": "",
        "type": "uint256"
      }
    ],
    "payable": false,
    "type": "function"
  },
  {
    "constant": true,
    "inputs": [],
    "name": "version",
    "outputs": [
      {
        "name": "",
        "type": "string"
      }
    ],
    "payable": false,
    "type": "function"
  },
  {
    "constant": true,
    "inputs": [
      {
        "name": "_owner",
        "type": "address"
      }
    ],
    "name": "balanceOf",
    "outputs": [
      {
        "name": "balance",
        "type": "uint256"
      }
    ],
    "payable": false,
    "type": "function"
  },
  {
    "constant": true,
    "inputs": [],
    "name": "symbol",
    "outputs": [
      {
        "name": "",
        "type": "string"
      }
    ],
    "payable": false,
    "type": "function"
  },
  {
    "constant": false,
    "inputs": [
      {
        "name": "_to",
        "type": "address"
      },
      {
        "name": "_value",
        "type": "uint256"
      }
    ],
    "name": "transfer",
    "outputs": [
      {
        "name": "success",
        "type": "bool"
      }
    ],
    "payable": false,
    "type": "function"
  },
  {
    "constant": false,
    "inputs": [
      {
        "name": "_spender",
        "type": "address"
      },
      {
        "name": "_value",
        "type": "uint256"
      },
      {
        "name": "_extraData",
        "type": "bytes"
      }
    ],
    "name": "approveAndCall",
    "outputs": [
      {
        "name": "success",
        "type": "bool"
      }
    ],
    "payable": false,
    "type": "function"
  },
  {
    "constant": true,
    "inputs": [
      {
        "name": "_owner",
        "type": "address"
      },
      {
        "name": "_spender",
        "type": "address"
      }
    ],
    "name": "allowance",
    "outputs": [
      {
        "name": "remaining",
        "type": "uint256"
      }
    ],
    "payable": false,
    "type": "function"
  },
  {
    "inputs": [
      {
        "name": "_initialAmount",
        "type": "uint256"
      },
      {
        "name": "_tokenName",
        "type": "string"
      },
      {
        "name": "_decimalUnits",
        "type": "uint8"
      },
      {
        "name": "_tokenSymbol",
        "type": "string"
      }
    ],
    "type": "constructor"
  },
  {
    "payable": false,
    "type": "fallback"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "name": "_from",
        "type": "address"
      },
      {
        "indexed": true,
        "name": "_to",
        "type": "address"
      },
      {
        "indexed": false,
        "name": "_value",
        "type": "uint256"
      }
    ],
    "name": "Transfer",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "name": "_owner",
        "type": "address"
      },
      {
        "indexed": true,
        "name": "_spender",
        "type": "address"
      },
      {
        "indexed": false,
        "name": "_value",
        "type": "uint256"
      }
    ],
    "name": "Approval",
    "type": "event"
  },
]

},{}]},{},[1]);
