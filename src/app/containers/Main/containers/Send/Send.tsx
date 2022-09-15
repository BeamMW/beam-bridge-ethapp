import React, { useState, useRef, useEffect } from 'react';
import { styled } from '@linaria/react';
import { Button, CurrInput, Input, Window } from '@app/shared/components';
import { css } from '@linaria/core';
import { calcSomeFee } from '@core/appUtils';
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
import { ethId, CURRENCIES } from '@app/shared/constants';
import { selectBalance, selectRate } from '../../store/selectors';
import { useFormik } from 'formik';

const metaMaskController = MetaMaskController.getInstance();

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

  const [selectedCurrency, setSelectedCurrency] = useState(null);
  const [feeVal, setFeeVal] = useState('');
  const [ethFeeVal, setEthFeeVal] = useState(null);
  const [addressValue, setAddress] = useState('');
  const [parsedAddressValue, setParsedAddressValue] = useState('');
  const [isFromParams, setIsFromParams] = useState(false);
  const [isAdrressValid, setIsAddressValid] = useState(true);
  const [isAllowed, setIsAllowed] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isDisabled, setIsDisabled] = useState(true);
  const [availableBalance, setAvailableBalance] = useState({
    value: 0,
    rate: 0
  })
  // const balance = useStore($balance);

  const { address } = useParams();

  
  const validate = async (formValues: SendFormData) => {
    const errorsValidation: any = {};
    const {
        send_amount
    } = formValues;

    if (Number(send_amount) === 0) {
      errorsValidation.send_amount = `Invalid amount`;
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

  const isFormDisabled = () => {
    if (!formik.isValid) return !formik.isValid;
    return false;
  };

  const isSendAmountValid = () => {
    return !errors.send_amount;
  }

  const resetState = () => {
    setAddress('');
    setFeeVal('');
    setParsedAddressValue('');
    setIsFromParams(false);
    setIsAddressValid(true);
    setIsAllowed(null);
    setIsLoaded(false);
    setIsDisabled(true);
    setSelectedCurrency(null)
  }
  
  useEffect(() => {
    if (address && balance.length > 0) {
      const addressValidationRes = validateAddress(address);
      if (addressValidationRes) {
        const parsedCurrency =  loadCurr(addressValidationRes);
        if (parsedCurrency) {
          setSelectedCurrency(parsedCurrency);
          setIsFromParams(true);
          setIsAddressValid(true);
          setAddress(address);
          setFieldValue('address', address, true);

          if (parsedCurrency.id !== ethId) {
            const fromBalance = balance.find((item) => item.curr_id === parsedCurrency.id)
            setIsAllowed(fromBalance.is_approved);

            // if (isAllowed) {
            //   calcFee(parsedCurrency);
            // }
          } else {
            setIsAllowed(true);
            //calcFee(parsedCurrency);
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

  const getBalance = (id: number) => {
    return balance.find((item) => {
      return item.id === id;
    }).value;
  }

  useEffect(() => {
    if (selectedCurrency) {
      setAvailableBalance({
        value: getBalance(selectedCurrency.curr_id),
        rate: rates[selectedCurrency.rate_id].usd
      });
      calcFee(selectedCurrency);
    }
  }, [selectedCurrency])

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
      curr = CURRENCIES.find((item) => {
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
        setSelectedCurrency(parsedCurrency);

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
      setSelectedCurrency(null);
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
      account: systemState.account
    };

    console.log('Send data: ', sendData);
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
    window.open('https://beam.mw/downloads/mainnet', '_blank').focus();
  }

  const handleAssetChange = (amount: string) => {
    setFieldValue('send_amount', amount, true);
    getEthFee(amount);
  };

  const handleAddressChange = (address: string) => {
    setFieldValue('address', address, true);
  }

  const addMaxClicked = () => {
    setFieldValue('send_amount', availableBalance.value, true);
    getEthFee(availableBalance.value);
  }

  const getEthFee = async (amount) => {
    let address = isFromParams ? parsedAddressValue : values.address as string;
    if (address.length > 66) {
      address = address.slice(-66)
    }
    
    const sendData = {
      address,
      amount,
      fee: parseFloat(feeVal),
      selectedCurrency,
      account: systemState.account
    };

    const fee = await metaMaskController.loadEthFee(sendData);
    console.log('ETH FEE', fee);
    setEthFeeVal(fee);
  }

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
              variant="common"
              value={values.address}
              onChangeHandler={handleAddressChange}
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
            <Input 
              variant='amount'
              selectedCurrency={selectedCurrency}
              onChangeHandler={handleAssetChange}
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
                <FeeValue>{feeVal} {selectedCurrency.name}</FeeValue>
              </FeeItem>
              <FeeItem>
                <FormSubtitle className={FeeSubtitleClass}>EXPECTED ETHEREUM NETWORK FEE</FormSubtitle>
                {ethFeeVal ? <FeeValue>{ethFeeVal} ETH</FeeValue> : <></>}
              </FeeItem>
            </FeeContainer>
            <Button className={TransferButtonClass}
                  type="submit"
                  disabled={isFormDisabled()}
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
    </Window>) : (<></>)
  );
};

export default Send;
