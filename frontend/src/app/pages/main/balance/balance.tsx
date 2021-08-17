import React, { useState } from 'react';
import { useStore } from 'effector-react';
import { styled } from '@linaria/react';
import { css } from '@linaria/core';
import MetaMaskOnboarding from '@metamask/onboarding';
import { 
  setView, View, 
  $accounts, $ethBalance,
  $usdtBalance
} from '@state/shared';
import { ActiveAccount, BalanceCard, Button } from '@pages/shared';
import { getBalance } from '@state/init';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
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

const handleSendClick: React.MouseEventHandler = () => {
  setView(View.SEND);
};

const Balance = () => {
  const account = useStore($accounts);
  const ethBalance = useStore($ethBalance) / Math.pow(10, 18);
  const usdtBalance = useStore($usdtBalance) / Math.pow(10, 8);

  return (
    <Container>
        <ActiveAccount text={account[0]}></ActiveAccount>
        <Title>ETH to BEAM Bridge</Title>
        <Content>
            <ContentHeader>Balance</ContentHeader>
            <BalanceCard type="usdt" balanceValue={usdtBalance}></BalanceCard>
            <BalanceCard type="eth" balanceValue={ethBalance}></BalanceCard>
            <StyledControls>
              <Button color="send" onClick={handleSendClick}>send</Button>
              {/* <Button color="receive">receive</Button> */}
            </StyledControls>
        </Content>
    </Container>
  );
};

export default Balance;
