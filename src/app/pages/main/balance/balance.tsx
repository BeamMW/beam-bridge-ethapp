import React, { useEffect } from 'react';
import { useStore } from 'effector-react';
import { styled } from '@linaria/react';
import { 
  setView, View, 
  $accounts,
  $balance,
  $income,
  $isInProgress,
  $transactionsList,
  getTransactionsListFx,
  $rate
} from '@state/shared';
import { css } from '@linaria/core';
import { Window, BalanceCard, Button, Table } from '@pages/shared';
import { isNil } from '@core/utils';
import { currencies } from '@app/shared/consts';

import { IconReceive, IconSend} from '@app/icons';

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
  const data = useStore($transactionsList);
  const isInProgress = useStore($isInProgress);
  const rates = useStore($rate);

  useEffect(() => {
    getTransactionsListFx(account[0]);
  }, []);

  const transactionsList = useStore($transactionsList);
  console.log(transactionsList)

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
        const curr = currencies.find((data)=> data.ethTokenContract.toLowerCase() === item.contractAddress.toLowerCase());
        const rate = (parseInt(item.value) / (10 ** parseInt(item.tokenDecimal))) * rates[curr.rate_id].usd;
        return rate + ' USD';
      }
    },
    {
      name: 'status',
      title: 'Status'
    }
  ];

  return (
    <Window>
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
          { balance.map(({ curr_id, rate_id, value, icon }) => (
            <BalanceCard curr_id={curr_id} key={curr_id} rate_id={rate_id} type={icon} balanceValue={value}></BalanceCard>
          ))}
      </Content>
      <StyledTable>
        <Table config={TABLE_CONFIG} data={data} keyBy='pid'/>
      </StyledTable>
    </Window>
  );
};

export default Balance;
