import React, { useState, useRef } from 'react';
import { useStore } from 'effector-react';
import { styled } from '@linaria/react';
import { ActiveAccount, Button, Input } from '@pages/shared';
import { setView, View, $accounts } from '@state/shared';
import { send } from '@state/init';
import { currencies } from '@core/types';
import { $selectedCurrency, setCurrency } from '@state/send';
import MetaMaskController  from '@core/MetaMask';

const metaMaskController = MetaMaskController.getInstance();

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

const BackControlIcon = styled.object`
  display: block;
  margin-right: 15px;
`;

const BackControlText = styled.p`
  opacity: .3;
  font-size: 14px;
  font-weight: bold;
`;

const FormStyled = styled.form`
  width: 600px;
  backdrop-filter: blur(10px);
  border-radius: 10px;
  background-color: rgba(13, 77, 118, .9);
  padding: 40px 30px;
  display: flex;
  flex-direction: column;
`;

const FormTitle = styled.p`
  font-size: 24px;
  font-weight: bold;
  align-self: center;
`;

const FormSubtitle = styled.p`
  font-size: 14px;
  font-weight: bold;
  margin-top: 30px;
`;

const SendStyled = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 50px;
`;

const handleBackClick: React.MouseEventHandler = () => {
  setView(View.BALANCE);
};

const Send = () => {
  const addressInputRef = useRef<HTMLInputElement>();
  const amountInputRef = useRef<HTMLInputElement>();
  const feeInputRef = useRef<HTMLInputElement>();
  
  const account = useStore($accounts);
  const selectedCurrency = useStore($selectedCurrency);

  const [feeVal, setFeeVal] = useState(0);

  const inputChange = (event) => {
    let value = event.target.value;
    console.log(value);
  
    const key = value.slice(-66);
    let currName = null;
    let curr = null;
    if (key.length === 66) {
      currName = value.slice(1, value.length - 66);
      console.log(currName)
    }
  
    if (currName !== null) {
      curr = currencies.find((item) => {
        return item.name.toLowerCase() === currName;
      });
  
      if (curr) {
        setCurrency(curr);
        event.target.value = key;
  
        getFee(curr).then((data) => {
          setFeeVal(data);
        });
      }
    }
  };

  const getFee = async (curr) => {
    return await metaMaskController.calcSomeFee(curr.rate_id);
  }

  const handleSubmit: React.FormEventHandler<HTMLFormElement> = async event => {
    event.preventDefault();

    const data = new FormData(event.currentTarget);
    const address = data.get('address') as string;
    const amount = parseFloat(data.get('amount') as string);
    const fee = parseFloat(data.get('fee') as string);
    
    const sendData = {
      address,
      amount,
      fee,
      selectedCurrency,
      account: account[0]
    };

    console.log('Send data: ', sendData);
    send(sendData);
    setView(View.BALANCE);
  }

  const inputChangedHandler = (event) => {
    const updatedKeyword = event.target.value;
    // May be call for search result
  }

  return (
    <Container>
      <ActiveAccount text={account[0]}></ActiveAccount>
      <Title>ETH to BEAM Bridge</Title>
      <ControlStyled>
        <BackControl onClick={handleBackClick}>
          <BackControlIcon
            type="image/svg+xml"
            data={'./assets/icon-back.svg'}
            width="16"
            height="16"
          ></BackControlIcon>
          <BackControlText>
            back
          </BackControlText>
        </BackControl>
      </ControlStyled>
      <FormStyled autoComplete="off" noValidate onSubmit={handleSubmit}>
        <FormTitle>Send token to Beam</FormTitle>
        <FormSubtitle>BEAM BRIDGE CONTRACT ADDRESS</FormSubtitle>
        <Input onChange={ inputChange } variant='common' ref={addressInputRef} name="address"></Input>
        <FormSubtitle>AMOUNT</FormSubtitle>
        <Input variant='amount' ref={amountInputRef} name="amount"></Input>
        <FormSubtitle>FEE</FormSubtitle>
        <Input variant='fee' ref={feeInputRef} onChange={(event)=>inputChangedHandler(event)}  value={feeVal} name="fee"></Input>
        <SendStyled>
          <Button color="send" >send to beam</Button>
        </SendStyled>
      </FormStyled>
    </Container>
  );
};

export default Send;
