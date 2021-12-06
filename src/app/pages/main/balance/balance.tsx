import React, { useState } from 'react';
import { useStore } from 'effector-react';
import { styled } from '@linaria/react';
import { 
  setView, View, 
  $accounts,
  $balance,
  $income,
  $isInProgress
} from '@state/shared';
import { css } from '@linaria/core';
import { ActiveAccount, BalanceCard, Button, Table } from '@pages/shared';
import { isNil } from '@core/utils';

import { IconReceive, IconSend} from '@app/icons';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 50px;
`;

const Title = styled.h1`
  font-size: 56px;
  font-weight: 900;
  margin-bottom: 50px;
`;

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

const handleSendClick: React.MouseEventHandler = () => {
  setView(View.SEND);
};

const handleReceiveClick: React.MouseEventHandler = () => {
  setView(View.RECEIVE);
}

const Balance = () => {
  const account = useStore($accounts);
  const balance = useStore($balance);
  const data = useStore($income);

  const isInProgress = useStore($isInProgress);

  const TABLE_CONFIG = [
    {
      name: 'amount',
      title: 'Amount',
      fn: (value: string) => {
        return value + ' USDT';
      }
    },
    {
      name: 'status',
      title: 'Status'
    }
  ];

  return (
    <Container>
        <ActiveAccount text={account[0]}></ActiveAccount>
        <Title>Ethereum to Beam Bridge</Title>
        <StyledControls>
          <Button icon={IconSend}
          disabled={isInProgress}
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
            { balance.map(({ curr_id, value, icon }) => (
              <BalanceCard key={curr_id} type={icon} balanceValue={value}></BalanceCard>
            ))}
        </Content>
        <StyledTable>
          <Table config={TABLE_CONFIG} data={data} keyBy='pid'/>
        </StyledTable>
    </Container>
  );
};

export default Balance;
