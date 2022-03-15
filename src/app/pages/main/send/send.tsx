import React, { useState, useRef, useEffect } from 'react';
import { useStore } from 'effector-react';
import { styled } from '@linaria/react';
import { Button, Input, Window } from '@pages/shared';
import { 
  setView,
  $accounts,
  $balance } from '@state/shared';
import { send } from '@state/init';
import { currencies, ethId } from '@consts/common';
import { $selectedCurrency, setCurrency } from '@state/send';
import MetaMaskController  from '@core/MetaMask';
import {  useParams } from 'react-router-dom';
import {
  IconEthLarge,
  IconUsdtLarge,
  IconDaiLarge,
  IconWbtcLarge,
  IconSend,
  IconCheck
} from '@app/icons';
import { ROUTES } from '@consts/routes';

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

const FeeSubtitleClass = css`
  margin-top: 0 !important;
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

const TransferButtonClass = css`
  max-width: 180px !important;
  margin-top: 50px !important;
`;

const StyledSeparator = styled.div`
  height: 1px;
  width: 100%;
  background-color: rgba(255, 255, 255, 0.1);
  margin: 20px 0;
`;

const FeeContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
`;

const FeeItem = styled.div`
`;

const FeeValue = styled.div`
  font-size: 14px;
  font-weight: 600;
  color: #da68f5;
  margin-top: 10px;
`;

const Send = () => {
  const addressInputRef = useRef<HTMLInputElement>();
  const amountInputRef = useRef<HTMLInputElement>();
  
  const account = useStore($accounts);
  const selectedCurrency = useStore($selectedCurrency);

  const [feeVal, setFeeVal] = useState('');
  const [addressValue, setAddress] = useState('');
  const [parsedAddressValue, setParsedAddressValue] = useState('');
  const [isFromParams, setIsFromParams] = useState(false);
  const [isAdrressValid, setIsAddressValid] = useState(true);
  const [isAllowed, setIsAllowed] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isDisabled, setIsDisabled] = useState(true);
  const balance = useStore($balance);

  const { address } = useParams();
  
  useEffect(() => {
    if (address && balance.length > 0) {
      const addressValidationRes = validateAddress(address);
      if (addressValidationRes) {
        const parsedCurrency =  loadCurr(addressValidationRes);
        if (parsedCurrency) {
          setCurrency(parsedCurrency);
          setIsFromParams(true);
          setIsAddressValid(true);
          setAddress(address);

          if (parsedCurrency.id !== ethId) {
            const fromBalance = balance.find((item) => item.curr_id === parsedCurrency.id)
            setIsAllowed(fromBalance.is_approved);

            if (isAllowed) {
              calcFee(parsedCurrency);
            }
          } else {
            setIsAllowed(true);
            calcFee(parsedCurrency);
          }
          
          setIsLoaded(true);
        } else {
          setIsAddressValid(false);
        }
      } else {
        setIsAddressValid(false);
      }
    } else if (!address && balance.length > 0) {
      setIsLoaded(true);
    }
  }, [address, balance]);

  const validateAddress = (value: string) => {
    const key = value.slice(-66);
    let currName = null;
    if (key.length === 66) {
      currName = value.slice(1, value.length - 66);
      setParsedAddressValue(key);
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
      setFeeVal(fixed);
      setIsDisabled(false)
    });
  }

  const inputChange = (event) => {
    let value = event.target.value;
    const addressValidationRes = validateAddress(value);
    if (addressValidationRes) {
      const parsedCurrency =  loadCurr(addressValidationRes);
      if (parsedCurrency) {
        setCurrency(parsedCurrency);

        setIsAddressValid(true);
          
        if (parsedCurrency.id !== ethId) {
          const fromBalance = balance.find((item) => item.curr_id === parsedCurrency.id)
          setIsAllowed(fromBalance.is_approved);

          if (fromBalance.is_approved) {
            calcFee(parsedCurrency);
          }
        } else {
          setIsAllowed(true);
          calcFee(parsedCurrency);
        }
      }
    } else {
      setCurrency(null);
      setIsAddressValid(false);
    }
  };

  const getFee = async (curr) => {
    return await metaMaskController.calcSomeFee(curr.rate_id);
  }

  const handleSubmit: React.FormEventHandler<HTMLFormElement> = async event => {
    event.preventDefault();

    const data = new FormData(event.currentTarget);
    let address = isFromParams ? parsedAddressValue : data.get('address') as string;
    if (address.length > 66) {
      address = address.slice(-66)
    }
    const amount = parseFloat(data.get('amount') as string);
    
    const sendData = {
      address,
      amount,
      fee: parseFloat(feeVal),
      selectedCurrency,
      account: account
    };

    console.log('Send data: ', sendData);
    send(sendData);
    setView(ROUTES.BASE);
  }

  const handleBackClick: React.MouseEventHandler = () => {
    setView(ROUTES.BASE);

    //TODO clear states before back redirect
  };

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
    isLoaded ? (<Window>
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
        ? (<StyledAddressFromParams>{address}</StyledAddressFromParams>)
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
          ? (<>
            <FormSubtitle>AMOUNT</FormSubtitle>
            <Input variant='amount' ref={amountInputRef} name="amount"></Input>
            <StyledSeparator/>
            <FeeContainer>
              <FeeItem>
                <FormSubtitle className={FeeSubtitleClass}>RELAYER FEE</FormSubtitle>
                <FeeValue>{feeVal}</FeeValue>
              </FeeItem>
              <FeeItem>
                <FormSubtitle className={FeeSubtitleClass}>EXPECTED ETHEREUM NETWORK FEE</FormSubtitle>
                <FeeValue>{0.0001}</FeeValue>
              </FeeItem>
            </FeeContainer>
            <Button className={TransferButtonClass}
                  type="submit"
                  disabled={isDisabled}
                  pallete='purple' icon={IconSend}>
                    transfer
            </Button>
          </>) 
          : (selectedCurrency !== null 
            ? (
              <>
                {ICONS[selectedCurrency.name.toLowerCase()]()}
                <ApproveDesc>
                  {`To send funds to BEAM please approve ${selectedCurrency.name} token first`}
                </ApproveDesc>
                <Button className={ApproveButtonClass}
                  onClick={()=>approveTokenClicked(selectedCurrency.id)}
                  color="send"
                  pallete='green' icon={IconCheck}>
                    approve token
                </Button>
              </>)
            : null)
        }
      </FormStyled>
      { 
        !isAdrressValid || addressValue.length === 0 
      ? (<InfoContainer>
        <InfoContainerTitle>In order to transfer from Ethereum to Beam network, do the following:</InfoContainerTitle>
        <ul>
          <InfoListItem>1.	Download the latest verison of <StyledLink>Beam Wallet</StyledLink> </InfoListItem>
          <InfoListItem>2.	Launch Bridges DApp from DApp store</InfoListItem>
          <InfoListItem>3.	Select <StyledLine>Ethereum to Beam</StyledLine> 
          and follow instructions to obtain Beam bridge address</InfoListItem>
          <InfoListItem>4.	Get back to this screen and paste the address</InfoListItem>
        </ul>
      </InfoContainer>)
      : null }
    </Window>) : (<></>)
  );
};

export default Send;
