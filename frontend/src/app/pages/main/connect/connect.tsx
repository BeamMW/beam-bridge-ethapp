import React, { useState } from 'react';
import { useStore } from 'effector-react';
import { styled } from '@linaria/react';
import { css } from '@linaria/core';
import MetaMaskOnboarding from '@metamask/onboarding';
import { setView, View } from '@state/shared';

const ONBOARD_TEXT = 'CONNECT WALLET';
const CONNECT_TEXT = 'CONNECT WALLET';
const CONNECTED_TEXT = 'Connected';

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
  margin-top: 32px;
  font-size: 24px;
`;

const connectButton = css`
  margin-top: 80px;
  cursor: pointer;
  border: none;
  padding: 16px 40px;
  border-radius: 50px;
  background-color: #fff;
`;

const connectButtonText = css`
  font-size: 16px;
  font-weight: bold;
  color: #032e49;
`;

declare global {
  interface Window {
      ethereum: any;
  }
}

const Connect = () => {
  const [active, setActive] = useState(null);
  const [buttonText, setButtonText] = React.useState(ONBOARD_TEXT);
  const [isDisabled, setDisabled] = React.useState(false);
  const [accounts, setAccounts] = React.useState([]);

  const onboarding = React.useRef<MetaMaskOnboarding>();
  
  React.useEffect(() => {
    if (!onboarding.current) {
      onboarding.current = new MetaMaskOnboarding();
    }
  }, []);

  React.useEffect(() => {
    if (MetaMaskOnboarding.isMetaMaskInstalled()) {
      if (accounts.length > 0) {
        setView(View.BALANCE);
        setButtonText(CONNECTED_TEXT);
        setDisabled(true);
        onboarding.current.stopOnboarding();
      } else {
        setButtonText(CONNECT_TEXT);
        setDisabled(false);
      }
    }
  }, [accounts]);

  React.useEffect(() => {
    function handleNewAccounts(newAccounts) {
      setAccounts(newAccounts);
    }
    if (MetaMaskOnboarding.isMetaMaskInstalled()) {
      window.ethereum
        .request({ method: 'eth_requestAccounts' })
        .then(handleNewAccounts);
      window.ethereum.on('accountsChanged', handleNewAccounts);
      return () => {
        if (window.ethereum.off !== undefined) {
          window.ethereum.off('accountsChanged', handleNewAccounts);
        }
      };
    }
  }, []);

  const onClick = () => {
    if (MetaMaskOnboarding.isMetaMaskInstalled()) {
      window.ethereum
        .request({ method: 'eth_requestAccounts' })
        .then((newAccounts) => setAccounts(newAccounts));
    } else {
      onboarding.current.startOnboarding();
    }
  };

  return (
    <Container>
      <Title>ETH to BEAM Bridge</Title>
      <Subtitle>Send funds through BEAM Smart Contract</Subtitle>
      <button className={connectButton} disabled={isDisabled} onClick={onClick}>
        <span className={connectButtonText}>{buttonText}</span>
      </button>
    </Container>
  );
};

export default Connect;
