import React, { useState, useRef, useEffect } from 'react';
import { useStore } from 'effector-react';
import { styled } from '@linaria/react';
import { ActiveAccount, Button, Input, Window } from '@pages/shared';
import { setView, View, $accounts } from '@state/shared';
import { send } from '@state/init';
import { currencies, ethId } from '@consts/common';
import { $selectedCurrency, setCurrency } from '@state/send';
import MetaMaskController  from '@core/MetaMask';
import { useSearchParams } from 'react-router-dom';
import {
  IconEthLarge,
  IconUsdtLarge,
  IconDaiLarge,
  IconWbtcLarge,
  IconSend,
  IconCheck
} from '@app/icons';

import { IconBack } from '@app/icons';
import { css } from '@linaria/core';

const metaMaskController = MetaMaskController.getInstance();

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
  font-size: 14px;
  font-weight: bold;
  margin-left: 15px;
`;

const FormStyled = styled.form`
  width: 600px;
  border-radius: 10px;
  backdrop-filter: blur(10px);
  background-image: linear-gradient(to bottom, rgba(218, 104, 245, 0.5), rgba(218, 104, 245, 0)), linear-gradient(to bottom, #0d4d76, #0d4d76);
  padding: 50px 30px;
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
  letter-spacing: 2.63px;
`;

const SendStyled = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 50px;
`;

const StyledAddressFromParams = styled.div`
  word-break: break-word;
  font-size: 16px;
  margin-top: 20px;
`;

const InfoContainer = styled.div`
  margin-top: 20px;
  width: 600px;
  padding: 50px
  border-radius: 10px;
  background-color: rgba(13, 77, 118, .95);
`;

const InfoContainerTitle = styled.div`
  font-size: 14px;
  font-style: italic;
  opacity: 0.7;
  margin-bottom: 20px;
`;

const InfoListItem = styled.li`
  line-height: 1.57;
  font-size: 14px;
  font-style: italic;
  color: rgba(255, 255, 255, .7)
`;

const StyledLink = styled.span`
  cursor: pointer;
  font-weight: bold;
  color: #05e2c2;
`;

const StyledLine = styled.span`
  color: #ffffff;
  font-weight: bold;
`;

const AddressType = styled.div`
  margin-top: 8px;
  opacity: 0.5;
  font-size: 12px;
`;

const CurrencyIconClass = css`
  margin: 50px auto 0;
`;

const ApproveDesc = styled.div`
  opacity: 0.7;
  font-style: italic;
  font-size: 14px;
  margin: 30px auto 0;
`;

const ApproveButtonClass = css`
  margin-top: 30px !important;
`;

const Send = () => {
  const addressInputRef = useRef<HTMLInputElement>();
  const amountInputRef = useRef<HTMLInputElement>();
  const feeInputRef = useRef<HTMLInputElement>();
  
  const account = useStore($accounts);
  const selectedCurrency = useStore($selectedCurrency);

  const [feeVal, setFeeVal] = useState(0);
  const [addressValue, setAddress] = useState('');
  const [isFromParams, setIsFromParams] = useState(false);
  const [isAdrressValid, setIsAddressValid] = useState(true);
  const [searchParams, setSearchParams] = useSearchParams();
  const [isAllowed, setIsAllowed] = useState(null);
  const addressFromParams = searchParams.get('address');
  let allowanceCheckInterval = null;

  useEffect(() => {
    if (addressFromParams && addressFromParams.length > 0) {
      addressInputRef.current.value = addressFromParams;
      const addressValidationRes = validateAddress(addressFromParams);
      if (addressValidationRes) {
        const parsedCurrency =  loadCurr(addressValidationRes);
        if (parsedCurrency) {
          setCurrency(parsedCurrency);
          setIsFromParams(true);
          setIsAddressValid(true);
          calcFee(parsedCurrency);
          setAddress(addressFromParams);

          if (parsedCurrency.id !== ethId) { 
            checkTokenAllowance(parsedCurrency);
          } else {
            setIsAllowed(true);
          }
        } else {
          setIsAddressValid(false);
        }
      } else {
        setIsAddressValid(false);
      }
    }
  }, []);

  const checkTokenAllowance = (parsedCurrency) => {
    metaMaskController.loadAllowance(parsedCurrency).then(value => {
      setIsAllowed(value);
      if (value) {
        allowanceCheckInterval ? clearInterval(allowanceCheckInterval) : null;
      } else {
        allowanceCheckInterval = setInterval(() => checkTokenAllowance(parsedCurrency), 3000);
      }
    });
  }

  const handleBackClick: React.MouseEventHandler = () => {
    setSearchParams('');
    setView(View.BALANCE);
  };

  const validateAddress = (value: string) => {
    const key = value.slice(-66);
    let currName = null;
    if (key.length === 66) {
      currName = value.slice(1, value.length - 66);
    }

    return currName;
  }

  const loadCurr = (currName) => {
    let curr = null;
    if (currName !== null) {
      curr = currencies.find((item) => {
        return item.name.toLowerCase() === currName;
      });
    }

    return curr;
  }

  const calcFee = (curr) => {
    getFee(curr).then((data) => {
      console.log(data);
      const fixed = data.toFixed(curr.validator_dec);
      //feeInputRef.current.value = fixed;
    });
  }

  const inputChange = (event) => {
    let value = event.target.value;
    validateAddress(value);
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

  const approveTokenClicked = (id: number) => {
    metaMaskController.approveToken(id);
  }

  const ICONS = {
    usdt: () => (<IconUsdtLarge className={CurrencyIconClass}/>),
    wbtc: () => (<IconWbtcLarge className={CurrencyIconClass}/>),
    dai: () => (<IconDaiLarge className={CurrencyIconClass}/>),
    eth: () => (<IconEthLarge className={CurrencyIconClass}/>),
  };  

  return (
    <Window>
      <ControlStyled>
        <BackControl onClick={handleBackClick}>
          <IconBack/>
          <BackControlText>
            back
          </BackControlText>
        </BackControl>
      </ControlStyled>
      <FormStyled autoComplete="off" noValidate onSubmit={handleSubmit}>
        <FormTitle>Ethereum to Beam</FormTitle>
        <FormSubtitle>BEAM BRIDGE ADDRESS</FormSubtitle>
        { 
          isFromParams && isAdrressValid
        ? (<StyledAddressFromParams>{addressFromParams}</StyledAddressFromParams>)
        : (<Input placeholder='Paste Beam bridge address here' 
              onChange={ inputChange } 
              variant='common' 
              ref={addressInputRef} 
              name="address"/>)
        }
        {
          isAdrressValid && selectedCurrency !== null ? (
          <>
            <AddressType>
              {`${selectedCurrency.name} address`}
            </AddressType>
          </>) : null
        }
        {
          isAdrressValid && isAllowed 
          ? (<>allowed</>) 
          : (selectedCurrency !== null 
            ? (
              <>
                {ICONS[selectedCurrency.name.toLowerCase()]()}
                <ApproveDesc>
                  {`To send funds to this address you need to approve ${selectedCurrency.name} token first`}
                </ApproveDesc>
                <Button className={ApproveButtonClass}
                  onClick={()=>approveTokenClicked(selectedCurrency.id)}
                  color="send" type="submit" 
                  pallete='green' icon={IconCheck}>
                    approve token
                </Button>
              </>)
            : null)
        }

        {/* <FormSubtitle>AMOUNT</FormSubtitle>
        <Input variant='amount' ref={amountInputRef} name="amount"></Input>
        <FormSubtitle>FEE</FormSubtitle>
        <Input variant='fee' ref={feeInputRef} name="fee"></Input> */}
        {/* <SendStyled>
          <Button color="send" type="submit" pallete='purple' icon={IconSend}>transfer</Button>
        </SendStyled> */}
      </FormStyled>
      { 
        !isAdrressValid || addressValue.length === 0 
      ? (<InfoContainer>
        <InfoContainerTitle>In order to transfer from Ethereum to Beam network, do the following:</InfoContainerTitle>
        <ul>
          <InfoListItem>1.	Download the latest verison of <StyledLink>Beam Wallet</StyledLink> </InfoListItem>
          <InfoListItem>2.	Launch Bridges DApp from DApp store</InfoListItem>
          <InfoListItem>3.	Select <StyledLine>Ethereum to Beam</StyledLine> and follow instructions to obtain Beam bridge address</InfoListItem>
          <InfoListItem>4.	Get back to this screen and paste the address</InfoListItem>
        </ul>
      </InfoContainer>)
      : null }
    </Window>
  );
};

export default Send;
