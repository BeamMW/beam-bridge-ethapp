import React, { useState, useRef } from 'react';
import { useStore } from 'effector-react';
import { styled } from '@linaria/react';
import { ActiveAccount, Button, Input } from '@pages/shared';
import { setView, View, $accounts } from '@state/shared';

import { IconBack, IconCopy } from '@app/icons';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-bottom: 50px;
`;

const Title = styled.h1`
  font-size: 56px;
  font-weight: 900;
`;

const ControlStyled = styled.div`
  width: 600px;
  margin: 20px auto;
  flex-direction: row;
  display: flex;
`;

const BackControl = styled.div`
  cursor: pointer;
  display: flex;
  flex-direction: row;
`;

const BackControlText = styled.p`
  opacity: .3;
  margin-left: 15px;
  font-size: 14px;
  font-weight: bold;
`;

const FormStyled = styled.div`
  width: 600px;
  border-radius: 10px;
  backdrop-filter: blur(10px);
  background-image: linear-gradient(to bottom, rgba(11, 204, 247, 0.3), rgba(11, 204, 247, 0)), 
    linear-gradient(to bottom, #0d4d76, #0d4d76);
  padding: 40px 30px;
  display: flex;
  flex-direction: column;
`;

const FormTitle = styled.p`
  font-size: 24px;
  font-weight: bold;
  align-self: center;
`;

const ReceiveStyled = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 50px;
`;

const AddressTitle = styled.div`
  margin: 50px auto 0;
  opacity: .7;
  font-style: italic;
`;

const Address = styled.div`
  margin: 20px auto 0;
  line-height: 1.43;
`;

const PasteInfo = styled.div`
  margin: 30px auto 0;
  opacity: .7;
  font-style: italic;
`;

const handleBackClick: React.MouseEventHandler = () => {
  setView(View.BALANCE);
};

const Receive = () => {
  const account = useStore($accounts);
  
  const handleCopyClick: React.MouseEventHandler = () => {
    const el = document.createElement('textarea');
    el.value = account[0];
    document.body.appendChild(el);
    el.select();
    document.execCommand('copy');
    document.body.removeChild(el);
    setView(View.BALANCE);
  };

  return (
    <Container>
      <ActiveAccount text={account[0]}></ActiveAccount>
      <Title>Ethereum to Beam Bridge</Title>
      <ControlStyled>
        <BackControl onClick={handleBackClick}>
          <IconBack/>
          <BackControlText>
            back
          </BackControlText>
        </BackControl>
      </ControlStyled>
      <FormStyled>
        <FormTitle>Beam to Ethereum</FormTitle>
        <AddressTitle>Your Ethereum Bridge address:</AddressTitle>
        <Address>{account[0]}</Address>
        <ReceiveStyled>
          <Button onClick={handleCopyClick}
          pallete='blue'
          icon={IconCopy}
          color="send">copy and close</Button>
        </ReceiveStyled>
        <PasteInfo>Paste this address in Beam wallet</PasteInfo>
      </FormStyled>
    </Container>
  );
};

export default Receive;
