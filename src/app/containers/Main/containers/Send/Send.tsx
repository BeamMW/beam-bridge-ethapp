import React, { useState, useRef, useEffect } from 'react';
import { styled } from '@linaria/react';
import { Button, Input, Window, Rate } from '@app/shared/components';
import { css } from '@linaria/core';
import { 
  IconBack,
  IconSend,
  IconDaiLarge,
  IconEthLarge,
  IconUsdtLarge,
  IconWbtcLarge,
  IconCheck,
  IconSendPink
} from '@app/shared/icons';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '@app/shared/constants';
import { selectSystemState } from '@app/shared/store/selectors';
import MetaMaskController  from '@core/MetaMask';
import { useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { ethId, CURRENCIES, ETH_RATE_ID } from '@app/shared/constants';
import { selectBalance, selectIsApproveInProgress, selectRate } from '../../store/selectors';
import { useFormik } from 'formik';
import { Currency } from '@app/core/types';

const metaMaskController = MetaMaskController.getInstance();
const BEAM_ADDRESS_LENGTH = 66;

interface SendFormData {
  send_amount: string;
  address: string;
}

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

const FeeSubtitleWarningClass = css`
  color: var(--color-red);
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
  margin-right: 4px;
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
  > .fee-warning{
    font-size: 14px;
    font-weight: 600;
    color: var(--color-red);
    font-style: italic;
    margin-top: 10px;
  }
`;

const rateStyle = css`
  font-size: 12px;
  align-self: start;
`;

const FeeValue = styled.div`
  font-size: 14px;
  font-weight: 600;
  color: #da68f5;
  margin-top: 10px;
`;


const AvailableContainer = styled.div`
  display: flex;
  flex-direction: column;
  margin-top: 30px;

  > .header {
    font-weight: 700;
    font-size: 14px;
    line-height: 17px;
    letter-spacing: 3.11111px;
    display: flex;

    > .add-max {
      margin-left: auto;
      cursor: pointer;
      display: flex;

      > .text {
        font-weight: 700;
        font-size: 14px;
        line-height: 17px;
        color: #DA68F5;
        margin-left: 10px;
      }
    }
  }

  > .balance {
    margin-top: 10px;
    font-weight: 400;
    font-size: 14px;
  }

  > .rate {
    margin-top: 5px;
    font-size: 12px;
    mix-blend-mode: normal;
    opacity: 0.5;
  }
`;

const Send = () => {
  const navigate = useNavigate();
  const addressInputRef = useRef<HTMLInputElement>();
  const amountInputRef = useRef<HTMLInputElement>();
  const systemState = useSelector(selectSystemState());
  const balance = useSelector(selectBalance());
  const rates = useSelector(selectRate());
  const isApproveInProgress = useSelector(selectIsApproveInProgress());

  const [selectedCurrency, setSelectedCurrency] = useState(null);
  const [relayerFeeVal, setRelayerFeeVal] = useState(null);
  const [ethFeeVal, setEthFeeVal] = useState(null);
  const [parsedAddressValue, setParsedAddressValue] = useState(null);
  const [isAllowed, setIsAllowed] = useState(null);
  const [isNetworkFeeAvailable, setIsNetworkFeeAvailable] = useState(false);
  
  let relayerFeeInterval = null;

  const [isLoaded, setIsLoaded] = useState(false);
  const [availableBalance, setAvailableBalance] = useState({
    value: 0,
    rate: 0
  })
  const { address: addressFromParams } = useParams();

  const validate = async (formValues: SendFormData) => {
    const errorsValidation: any = {};
    const {
        send_amount,
        address
    } = formValues;

    // if (Number(send_amount) === 0) {
    //   errorsValidation.send_amount = `Incorrect amount`;
    // }

    let parsedCurrency = addressFromParams ? parseCurrency(addressFromParams) : null;
    if (!parsedCurrency) {
      parsedCurrency =  parseCurrency(address);
    }

    const regex = new RegExp('^[A-Za-z0-9]+$');
    if (!regex.test(address || addressFromParams) || !parsedCurrency) {
      errorsValidation.address = `Unrecognized address`;
    }
    
    if (parsedCurrency && relayerFeeVal && !metaMaskController.isDisabled) {
      const sendAmount = Number(send_amount);
      const fromBalance = balance.find((item) => item.curr_id === parsedCurrency.id);
      const ethBalance = balance.find((item) => item.curr_id === ethId);
      if (parsedCurrency.id === ethId ? 
        (sendAmount + relayerFeeVal + ethFeeVal) > fromBalance.value : 
        (sendAmount + relayerFeeVal) > fromBalance.value) {
        errorsValidation.send_amount = `Insufficient funds to complete the transaction.`;
        setIsNetworkFeeAvailable(false);
      } else {
        if (sendAmount < relayerFeeVal) {
          setIsNetworkFeeAvailable(false);
          errorsValidation.send_amount = `Insufficient funds to pay transaction fee.`;
        } else {
          setIsNetworkFeeAvailable((sendAmount + relayerFeeVal) <= fromBalance.value);

          if (parsedCurrency.id === ethId) {
            if (sendAmount < (relayerFeeVal + ethFeeVal)) {
              errorsValidation.send_amount = `Insufficient funds to pay transaction fee.`;
            }
          } else {
            if (ethBalance.value < ethFeeVal) {
              errorsValidation.send_amount = `Insufficient funds to pay transaction fee.`;
            }
          }
        }
      }
      //Maximum amount is ${fromBalance.value} ${parsedCurrency.name}      
    }

    return errorsValidation;
  };

  const formik = useFormik<SendFormData>({
    initialValues: {
        send_amount: '',
        address: ''
    },
    isInitialValid: false,
    onSubmit: (value) => {
    
    },
    validate: (e) => validate(e),
  });

  const {
    values, setFieldValue, errors, submitForm, resetForm
  } = formik;

  const isAddressValid = () => !errors.address;
  const isSendAmountValid = () => !errors.send_amount;

  const isFormDisabled = () => {
    if (!formik.isValid) return !formik.isValid;
    if (metaMaskController.isDisabled) return true;
    return false;
  };

  const resetState = () => {
    setRelayerFeeVal(null);
    setParsedAddressValue(null);
    setIsAllowed(null);
    setIsLoaded(false);
    setSelectedCurrency(null);
    metaMaskController.isDisabled = true;
  }

  //balance state
  useEffect(() => {
    if (balance.length > 0) {
      setIsLoaded(true);
    } else {
      setIsLoaded(false);
    }
  }, [balance]);
  
  //address from params
  useEffect(() => {
    if (addressFromParams && isLoaded) {
      const parsedCurrency = parseCurrency(addressFromParams);
      if (parsedCurrency) {
        setSelectedCurrency(parsedCurrency);
      }
    }
  }, [addressFromParams, isLoaded]);

  //is allowed state
  useEffect(() => {
    if (selectedCurrency && balance.length > 0) {
      if (selectedCurrency.id !== ethId) {
        const fromBalance = balance.find((item) => item.curr_id === selectedCurrency.id)
        setIsAllowed(fromBalance.is_approved);
      } else {
        setIsAllowed(true);
      }
    }
  }, [selectedCurrency, balance]);

  const getBalance = (id: number) => {
    const balanceItem = balance.find((item) => {
      return item.curr_id === id;
    });
    return balanceItem ? balanceItem.value : 0;
  }

  useEffect(() => {
    if (selectedCurrency && rates) {
      setAvailableBalance({
        value: getBalance(selectedCurrency.id),
        rate: rates[selectedCurrency.rate_id].usd
      });
      if (relayerFeeInterval) {
        relayerFeeInterval = setInterval(() => calcRelayerFee(selectedCurrency), 5000);
      }
      calcRelayerFee(selectedCurrency);
    } else {
      clearInterval(relayerFeeInterval);
      setRelayerFeeVal(null);
    }
  }, [selectedCurrency, rates])

  const parseCurrency = (value: string):Currency => {
    const key = value.slice(-BEAM_ADDRESS_LENGTH);
    if (key.length === BEAM_ADDRESS_LENGTH) {
      const currName = value.slice(1, value.length - BEAM_ADDRESS_LENGTH);
      const parsedCurrency = findCurrency(currName);
      if (parsedCurrency) {
        setParsedAddressValue(key);
        return parsedCurrency;
      }
    }

    return null;
  }

  const findCurrency = (currencyName: string) => {
    return CURRENCIES.find((item) => {
        return item.name.toLowerCase() === currencyName;
    });
  }

  const calcRelayerFee = (curr) => {
    metaMaskController.calcRelayerFee(curr.rate_id).then((data) => {
      const fixed = data.toFixed(curr.validator_dec);
      setRelayerFeeVal(Number(fixed));
    });
  }

  const handleSubmit: React.FormEventHandler<HTMLFormElement> = async event => {
    event.preventDefault();

    const data = new FormData(event.currentTarget);
    let address = addressFromParams ? parsedAddressValue : data.get('address') as string;
    if (address.length > 66) {
      address = address.slice(-66)
    }
    const amount = parseFloat(data.get('amount') as string);
    
    const sendData = {
      address,
      amount,
      fee: relayerFeeVal,
      selectedCurrency,
      account: systemState.account
    };

    metaMaskController.sendToken(sendData);
    resetState()
    navigate(ROUTES.MAIN.BASE);
  }

  const handleBackClick: React.MouseEventHandler = () => {
    resetState();
    navigate(ROUTES.MAIN.BASE);
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

  const handleDownloadClick: React.MouseEventHandler = () => {
    window.open('https://beam.mw/downloads/dappnet', '_blank').focus();
  }

  const handleAmountChange = (amount: string) => {
    const amountVal = Number(amount);
    if (metaMaskController.isDisabled && amountVal > 0) {
      metaMaskController.isDisabled = false;
    }

    setFieldValue('send_amount', amount, true);

    if (availableBalance.value >= (amountVal + relayerFeeVal) && amountVal > relayerFeeVal) {
      getEthFee(amount);
    } else {
      setEthFeeVal(null);
    }
  };

  const handleAddressChange = (address: string) => {
    setFieldValue('address', address, true);
    setFieldValue('send_amount', '', false);
    const parsedCurrency = parseCurrency(address);
    if (parsedCurrency) {
      setSelectedCurrency(parsedCurrency);
    }
  }

  const addMaxClicked = () => {
    if (metaMaskController.isDisabled) {
      metaMaskController.isDisabled = false;
    }

    const maxValue = availableBalance.value - relayerFeeVal;
    if (maxValue > 0) {
      setFieldValue('send_amount', availableBalance.value - relayerFeeVal, true);
      getEthFee(availableBalance.value - relayerFeeVal);
    }
  }

  const getEthFee = async (amount) => {
    let address = addressFromParams ? parsedAddressValue : values.address as string;
    if (address.length > 66) {
      address = address.slice(-66)
    }
    
    const sendData = {
      address,
      amount,
      fee: relayerFeeVal,
      selectedCurrency,
      account: systemState.account
    };

    const fee = await metaMaskController.loadEthFee(sendData);
    console.log('FEE: ', fee)
    setEthFeeVal(Number(fee));
  }

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
        { isLoaded && 
          <> { 
            addressFromParams && parsedAddressValue
            ? (<StyledAddressFromParams>{addressFromParams}</StyledAddressFromParams>)
            : (<Input placeholder='Paste Beam bridge address here' 
              valid={isAddressValid()}
              variant="common"
              label={errors.address}
              value={values.address}
              onChangeHandler={handleAddressChange}
              ref={addressInputRef} 
              name="address"/>)
          }
          {
            selectedCurrency !== null &&
            <AddressType>
              {`${selectedCurrency.name} address`}
            </AddressType>
          }
        {
          isAllowed ? 
          (<>
            <FormSubtitle>AMOUNT</FormSubtitle>
            <Input 
              variant='amount'
              selectedCurrency={selectedCurrency}
              onChangeHandler={handleAmountChange}
              label={errors.send_amount}
              valid={isSendAmountValid()}
              value={values.send_amount}
              ref={amountInputRef} name="amount"></Input>
            <AvailableContainer>
              <div className='header'>
                <span className='title'>AVAILABLE</span>
                <span className='add-max' onClick={addMaxClicked}>
                  <IconSendPink/>
                  <span className='text'>max</span>
                </span>
              </div>
              <div className='balance'> {availableBalance.value} {selectedCurrency.name} </div>
              <div className='rate'>{availableBalance.rate} USD</div>
            </AvailableContainer>
            <StyledSeparator/>
            <FeeContainer>
              <FeeItem>
                <FormSubtitle className={FeeSubtitleClass}>RELAYER FEE</FormSubtitle>
                {relayerFeeVal && <>
                  <FeeValue>{relayerFeeVal} {selectedCurrency.name}</FeeValue>
                  <Rate value={parseFloat(relayerFeeVal)} selectedCurrencyId={selectedCurrency.rate_id} className={rateStyle} />
                </>}
              </FeeItem>
              <FeeItem>
                <FormSubtitle className={!isNetworkFeeAvailable ? FeeSubtitleWarningClass : FeeSubtitleClass}>
                  EXPECTED ETHEREUM NETWORK FEE
                </FormSubtitle>
                {isNetworkFeeAvailable && ethFeeVal && <>
                  <FeeValue>{ethFeeVal} ETH</FeeValue>
                  <Rate value={parseFloat(ethFeeVal)} selectedCurrencyId={ETH_RATE_ID} className={rateStyle} />
                </>}
                {!isNetworkFeeAvailable && <div className='fee-warning'>Insufficient funds to calculate.</div>}
              </FeeItem>
            </FeeContainer>
            <Button className={TransferButtonClass}
                  type="submit"
                  disabled={isFormDisabled()}
                  pallete='purple' icon={IconSend}>
                    transfer
            </Button>
          </>) 
          : (selectedCurrency !== null &&
              <>
                {ICONS[selectedCurrency.name.toLowerCase()]()}
                <ApproveDesc>
                  {`To send funds to BEAM please approve ${selectedCurrency.name} token first`}
                </ApproveDesc>
                <Button className={ApproveButtonClass}
                  disabled={isApproveInProgress}
                  onClick={()=>approveTokenClicked(selectedCurrency.id)}
                  color="send"
                  pallete='green' icon={IconCheck}>
                    approve token
                </Button>
              </>)
        } 
        </>}
      </FormStyled>
      { 
       values.address.length === 0 
      ? (<InfoContainer>
        <InfoContainerTitle>In order to transfer from Ethereum to Beam network, do the following:</InfoContainerTitle>
        <ul>
          <InfoListItem>
            1.	Download the latest verison of <StyledLink onClick={handleDownloadClick}>Beam Wallet</StyledLink> 
          </InfoListItem>
          <InfoListItem>2.	Launch Bridges DApp from DApp store</InfoListItem>
          <InfoListItem>3.	Select <StyledLine>Ethereum to Beam</StyledLine> 
          and follow instructions to obtain Beam bridge address</InfoListItem>
          <InfoListItem>4.	Get back to this screen and paste the address</InfoListItem>
        </ul>
      </InfoContainer>)
      : null }
    </Window>
  );
};

export default Send;
