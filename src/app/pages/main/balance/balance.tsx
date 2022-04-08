import React, { useEffect } from 'react';
import { useStore } from 'effector-react';
import { styled } from '@linaria/react';
import { 
  setView,
  $balance,
  $isInProgress,
  $transactionsList,
  $rate
} from '@state/shared';
import { css } from '@linaria/core';
import { Window, BalanceCard, Button, Table } from '@pages/shared';
import { currencies } from '@app/shared/consts';
import { ROUTES } from '@consts/routes';
import { ethers } from 'ethers';

import { IconReceive, IconSend} from '@app/icons';

let ethersLib = null;

const Content = styled.div`
  width: 600px;
  margin: 50px auto 0 auto;
  padding: 45px 75px;
  border-radius: 10px;
  backdrop-filter: blur(10px);
  background-color: rgba(13, 77, 118, .4);
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const ContentHeader = styled.p`
  font-size: 24px;
  font-weight: bold;
  margin-bottom: 40px;
`;

const StyledControls = styled.div`
  margin-top: 50px;
  display: flex;
  flex-direction: row;
`;

const StyledTable = styled.div`
  margin-top: 30px;
  overflow: hidden;
  border-radius: 10px;
`;

const ReceiveButtonClass = css`
  margin-left: 20px !important;
`;

const BeamButtonClass = css`
  margin: 0 auto;
`;

const handleSendClick: React.MouseEventHandler = () => {
  setView(ROUTES.SEND);
};

const handleReceiveClick: React.MouseEventHandler = () => {
  setView(ROUTES.RECEIVE);
}


const download = (url, cback) => {
  var xhr = new XMLHttpRequest();
  xhr.onreadystatechange = function() {
      if(xhr.readyState === XMLHttpRequest.DONE) {
          if (xhr.status === 200) {
              let buffer    = xhr.response;
              let byteArray = new Uint8Array(buffer);
              let array     = Array.from(byteArray);

              if (!array || !array.length) {
                  return cback("empty shader");
              }
          
              return cback(null, array);
          } else {
              let errMsg = ["code", xhr.status].join(" ");
              return cback(errMsg);
          }
      }
  }
  xhr.open('GET', url, true);
  xhr.responseType = "arraybuffer";
  xhr.send(null);
}

const toHex = (bytes) => {
    return bytes.map(function (b) {
        return b.toString(16) 
    }).join('');
}

const handleBeamClick = () => {
  download("./app.wasm", async (err, bytes) => {
    //console.log(toHex(bytes));
      
      const { ethereum } = window;
      console.log(ethereum.isMetaMask);

      console.log(`account: ${ethereum.selectedAddress}`)

    const stateRequest = {
        jsonrpc: '2.0',
        id: 1,
        method: 'invoke_contract',
        params:
        {
            contract: bytes,
            args: 'role=user,action=view_state,cid=b09361e57d42ddad63dc06ce94706f82e11ad90cd63fa0d3dd7913e9edd9b902',
            create_tx: false
        }
    };

      const callRes = await ethereum.request({
          method: 'eth_call',
          params: [
              {
                  data: JSON.stringify(stateRequest)
              },
              'latest'
          ]
      });

      console.log(callRes);

      const myStateRequest = {
          jsonrpc: '2.0',
          id: 1,
          method: 'invoke_contract',
          params:
          {
              contract: bytes,
              args: `role=user,action=view_account,accountID=${ethereum.selectedAddress.slice(-40)},cid=b09361e57d42ddad63dc06ce94706f82e11ad90cd63fa0d3dd7913e9edd9b902`,
              create_tx: false
          }
      };

      const callRes2 = await ethereum.request({
          method: 'eth_call',
          params: [
              {
                  data: JSON.stringify(myStateRequest)
              },
              'latest'
          ]
      });
      console.log(callRes2);

    //const transactionParameters = {
    //  nonce: '0x00', // ignored by MetaMask
    //  gasPrice: '0x09184e72a000', // customizable by user during MetaMask confirmation.
    //  gas: '0x2710', // customizable by user during MetaMask confirmation.
    //  to: '0x0000000000000000000000000000000000000000', // Required except during contract publications.
    //  from: ethereum.selectedAddress, // must match user's active address.
    //  value: '0x00', // Only required to send ether to the recipient from the initiating external account.
    //  data:
    //    '0x7f7465737432000000000000000000000000000000000000000000000000000000600057', // Optional, but used for defining smart contract creation and interaction.
    //  chainId: '0x3', // Used to prevent transaction reuse across blockchains. Auto-filled by MetaMask.
    //};
    
    //// txHash is a hex string
    //// As with any RPC call, it may throw an error
    //const txHash = await ethereum.request({
    //  method: 'eth_sendTransaction',
    //  params: [transactionParameters],
    //});

    //console.log(txHash);


    // ethersLib = new ethers.providers.Web3Provider(window.ethereum);

    // let hashTx = await ethersLib.sendTransaction({
    //   from: '',
    //   to: '',
    //   data: '0x7f7465737432000000000000000000000000000000000000000000000000000000600057',
    //   gas: '0x09184e72a000',
    //   nonce: '0x00',
    // });

    // console.log(hashTx)
  });
}

const likeDislike = (like: boolean) => {

    download("./app.wasm", async (err, bytes) => {
        const { ethereum } = window;
        const action = like ? 'like' : 'dislike';

        const request = {
            jsonrpc: '2.0',
            id: 1,
            method: 'invoke_contract',
            params:
            {
                contract: bytes,
                args: `role=user,action=${action},accountID=${ethereum.selectedAddress.slice(-40)},cid=b09361e57d42ddad63dc06ce94706f82e11ad90cd63fa0d3dd7913e9edd9b902`,
            }
        };

        const callRes2 = await ethereum.request({
            method: 'eth_call',
            params: [
                {
                    data: JSON.stringify(request)
                },
                'latest'
            ]
        });
        console.log(callRes2);
    });

}

const handleLikeClick = () => {
    likeDislike(true);
}

const handleDislikeClick = () => {
    likeDislike(false);
}

const Balance = () => {
  const balance = useStore($balance);
  const data = useStore($transactionsList);
  const isInProgress = useStore($isInProgress);
  const rates = useStore($rate);

  const TABLE_CONFIG = [
    {
      name: 'value',
      title: 'Amount',
      fn: (value: string, item: any) => {
        const amount = parseInt(value) / (10 ** parseInt(item.tokenDecimal));
        return `${amount} ${item.tokenSymbol}`;
      }
    },
    {
      name: 'usd',
      title: 'USD value',
      fn: (value: string, item: any) => {
        if (rates.length > 0) {
          const curr = currencies.find((data)=> data.ethTokenContract.toLowerCase() === item.contractAddress.toLowerCase());
          const rate = (parseInt(item.value) / (10 ** parseInt(item.tokenDecimal))) * rates[curr.rate_id].usd;
          return rate + ' USD';
        } else {
          return '';
        }
      }
    },
    {
      name: 'status',
      title: 'Status'
    }
  ];

  return (
    <Window>
      <Button
        className={BeamButtonClass} 
        pallete="blue" 
        onClick={handleBeamClick}>
          View state
          </Button>
          <Button
              className={BeamButtonClass}
              pallete="green"
              onClick={handleLikeClick}>
              Like
          </Button>
          <Button
              className={BeamButtonClass}
              pallete="red"
              onClick={handleDislikeClick}>
              Dislike
          </Button>
      {/*<StyledControls>*/}
      {/*  <Button icon={IconSend}*/}
      {/*  disabled={isInProgress}*/}
      {/*  pallete="purple"*/}
      {/*  onClick={handleSendClick}>*/}
      {/*    ethereum to beam*/}
      {/*  </Button>*/}
      {/*  <Button icon={IconReceive} */}
      {/*  className={ReceiveButtonClass} */}
      {/*  pallete="blue" */}
      {/*  onClick={handleReceiveClick}>*/}
      {/*    beam to ethereum*/}
      {/*  </Button>*/}
      {/*</StyledControls>*/}
      {/*<Content>*/}
      {/*    <ContentHeader>Balance</ContentHeader>*/}
      {/*    { balance.map(({ curr_id, rate_id, value, icon, is_approved }) => (*/}
      {/*      <BalanceCard icon={icon} */}
      {/*        curr_id={curr_id}*/}
      {/*        key={curr_id}*/}
      {/*        rate_id={rate_id}*/}
      {/*        type={icon}*/}
      {/*        balanceValue={value}*/}
      {/*        is_approved={is_approved}*/}
      {/*      ></BalanceCard>*/}
      {/*    ))}*/}
      {/*</Content>*/}
      <StyledTable>
        <Table config={TABLE_CONFIG} data={data} keyBy='pid'/>
      </StyledTable>
    </Window>
  );
};

export default Balance;
