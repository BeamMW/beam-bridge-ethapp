import React, { useState } from 'react';
import { useStore } from 'effector-react';
import { styled } from '@linaria/react';
import { css } from '@linaria/core';
import MetaMaskOnboarding from '@metamask/onboarding';
import { setView, View } from '@state/shared';
import { ActiveAccount } from '@pages/shared';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const Title = styled.h1`
  font-size: 56px;
  font-weight: 900;
`;

const Content = styled.div`
    width: 600px;
    height: 420px;
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


const Balance = () => {

  return (
    <Container>
        <ActiveAccount></ActiveAccount>
        <Title>ETH to BEAM Bridge</Title>
        <Content>
            <ContentHeader>Balance</ContentHeader>
        </Content>
    </Container>
  );
};

export default Balance;
