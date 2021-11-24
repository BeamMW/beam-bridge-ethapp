import React, { useState } from 'react';
import { useStore } from 'effector-react';
import { styled } from '@linaria/react';
import { 
  setView, View, 
  $accounts, $ethBalance,
  $balance,
  $income
} from '@state/shared';
import { ActiveAccount, BalanceCard, Button, Table } from '@pages/shared';
import { isNil } from '@core/utils';

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
  background-color: #0d4d76;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const ContentHeader = styled.p`
  font-size: 24px;
  font-weight: bold;
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

const handleSendClick: React.MouseEventHandler = () => {
  setView(View.SEND);
};

const Balance = () => {
  const account = useStore($accounts);
  const balance = useStore($balance);
  const data = useStore($income);

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
        <Title>ETH to BEAM Bridge</Title>
        <Content>
            <ContentHeader>Balance</ContentHeader>
            { balance.map(({ curr_id, value, icon }) => (
              <BalanceCard key={curr_id} type={icon} balanceValue={value}></BalanceCard>
            ))}
            <StyledControls>
              <Button color="send" onClick={handleSendClick}>send</Button>
            </StyledControls>
        </Content>
        <StyledTable>
          <Table config={TABLE_CONFIG} data={data} keyBy='pid'/>
        </StyledTable>
    </Container>
  );
};

export default Balance;
