import React, { useEffect, useState } from 'react';
import { styled } from '@linaria/react';
import { css } from '@linaria/core';

import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Window, Button, Table } from '@app/shared/components';
import { selectAppParams, selectBridgeTransactions, selectRate } from '../../store/selectors';
import { IconMetamask } from '@app/shared/icons';
import { CURRENCIES, ROUTES } from '@app/shared/constants';
import { BridgeTransaction } from '@core/types';
import { connectToMetamask } from '@app/core/api';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const Title = styled.h1`
  margin-top: 240px
  font-size: 56px;
  font-weight: 900;
`;

const Subtitle = styled.h2`
  margin-top: 30px;
  font-size: 24px;
  text-align: center;
`;

const connectButtonClass = css`
  margin-top: 50px !important;
`;

const ButtonTextClass = css`
  float: right;
  margin-top: 10px;
`;

const Connect: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const rate = useSelector(selectRate());
  const bridgeTransactions = useSelector(selectBridgeTransactions());

  const TABLE_CONFIG = [
    {
      name: 'amount',
      title: 'Amount',
      fn: (value: string, tr: BridgeTransaction) => {
        // const curr = CURRENCIES.find((item) => item.cid === tr.cid);

        // return parseInt(value) / Math.pow(10, 8) + ' ' + curr.name;
      }
    },
    {
      name: 'status',
      title: 'Status'
    }
  ];

  const handleSendClick: React.MouseEventHandler = () => {
    navigate(ROUTES.MAIN.SEND);
  };
  
  const handleReceiveClick: React.MouseEventHandler = () => {
    navigate(ROUTES.MAIN.RECEIVE);
  };

  const handleConnect = () => {
    window.ethereum
      .request({ method: 'eth_requestAccounts' })
      .then(accounts => console.log(accounts))
  }

  return (
    <>
      <Window>
        <Container>
          <Title>ETH to BEAM Bridge</Title>
          <Subtitle>
            Transfer ETH, BTC, DAI and USDT.<br/>
            More tokens coming soon!
          </Subtitle>
          <Button icon={IconMetamask}
            pallete="white"
            variant="connect"
            onClick={connectToMetamask}>
              CONNECT WALLET
            </Button>
        </Container>
      </Window>
    </>
  );
};

export default Connect;
