import React, { useEffect, useState } from 'react';
import { styled } from '@linaria/react';
import { css } from '@linaria/core';

import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Window, Button, Table, BalanceCard } from '@app/shared/components';
import { selectAppParams, selectBalance, selectRate } from '../../store/selectors';
import { IconSend, IconReceive } from '@app/shared/icons';
import { CURRENCIES, ROUTES } from '@app/shared/constants';
import { selectTransactions } from '@app/shared/store/selectors';

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

const EmptyTableContent = styled.div`
  text-align: center;
  margin-top: 72px;
  font-size: 14px;
  font-style: italic;
  color: #8da1ad;
`;

const MainPage: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const rate = useSelector(selectRate());
  const bridgeTransactions = useSelector(selectTransactions());

  useEffect(() => {
    if (!rate) {
     // dispatch(loadRate.request());
    }
  }, [dispatch, rate]);

  const balance = useSelector(selectBalance());

  const TABLE_CONFIG = [
    {
      name: 'amount',
      title: 'Amount',
      fn: (value: string, tr: any) => {
        const curr = CURRENCIES.find((item) => { 
          return item.ethTokenContract.toLowerCase() === tr.contractAddress.toLowerCase()
        });
        if (curr) {
          const amount = parseInt(tr.value) / (10 ** curr.decimals);
        return `${amount} ${curr.name}`;
        }
      }
    },
    {
      name: 'status',
      title: 'Status',
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
        <StyledControls>
          <Button icon={IconSend}
          //disabled={isInProgress}
            pallete="purple"
            onClick={handleSendClick}>
              ethereum to beam
          </Button>
          <Button icon={IconReceive} 
            className={ReceiveButtonClass} 
            pallete="blue" 
            onClick={handleReceiveClick}>
              beam to ethereum
          </Button>
        </StyledControls>
        <Content>
          <ContentHeader>Balance</ContentHeader>
          { balance.map(({ curr_id, rate_id, value, icon, is_approved }) => (
            <BalanceCard icon={icon} 
              curr_id={curr_id}
              key={curr_id}
              rate_id={rate_id}
              type={icon}
              balanceValue={value}
              is_approved={is_approved}
            ></BalanceCard>
          ))}
        </Content>
        <StyledTable>
          <Table config={TABLE_CONFIG} data={bridgeTransactions} keyBy='transactionIndex'/>
          {bridgeTransactions.length === 0 && <EmptyTableContent>There are no transactions yet</EmptyTableContent>}
        </StyledTable>
      </Window>
    </>
  );
};

export default MainPage;
