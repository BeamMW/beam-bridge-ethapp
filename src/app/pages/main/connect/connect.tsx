import React, { useState, useEffect } from 'react';
import { styled } from '@linaria/react';
import { css } from '@linaria/core';
import { connectToMetaMask } from '@state/init';
import { Button } from '@pages/shared';
import { MetamaskLogo } from '@app/icons';
import { $accounts, setView } from '@state/shared';
import { useStore } from 'effector-react';
import { ROUTES } from '@app/shared/consts';

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

const Connect = () => {
  const account = useStore($accounts);

  useEffect(() => {
    if (account.length > 0) {
      setView(ROUTES.BASE); //TODO REDIRECT BY LINK TO SEND 
    }
  }, [account]);

  const onClick = () => {
    connectToMetaMask();
  };

  return (
    <Container>
      <Title>BEAM DAPP</Title>
      <Subtitle>
        Works with BEAM dapp via Metamask<br/>
      </Subtitle>
      <Button pallete="white" variant="darkest_blue" icon={MetamaskLogo} className={connectButtonClass} onClick={onClick}>
        <div className={ButtonTextClass}>CONNECT WALLET</div>
      </Button>
    </Container>
  );
};

export default Connect;
