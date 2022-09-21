import React from 'react';
import { styled } from '@linaria/react';
import { css } from '@linaria/core';
import { IconWbtc, IconEth, IconDai, IconUsdt } from '@app/shared/icons';
import { Currency } from '@app/core/types';
import { Rate } from '.';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: string;
  value: string;
  variant: 'amount' | 'common' | 'fee',
  selectedCurrency?: Currency,
  onChangeHandler?: (value: string) => void;
}

export const AMOUNT_MAX = 253999999.9999999;

interface DropdownProps {
  isVisible: boolean
}

const NumberInputClass = css`
  height: 59px;
`;

const AddressInputClass = css`
  height: 44px;
`;

const ContainerStyled = styled.div`
  margin-top: 20px;
  position: relative;
  background-color: rgba(255, 255, 255, .05);
  border-radius: 10px;
  width: 100%;
  display: flex;
  flex-direction: row;
  align-items: center;
  padding: 8px 15px;
`;

const InputStyled = styled.input<InputProps>`
  line-height: 20px;
  border: none;
  font-size: ${({ variant }) => `${variant === 'common' ? '16px' : '36px'}`};
  color: ${({ variant }) => `${variant === 'common' ? 'white' : '#da68f5'}`};
  background-color: transparent;
  width: ${({ variant }) => `${variant === 'common' ? '100%' : '90%'}`};
  height: 100%;
  -moz-appearance:textfield;

  &::-webkit-inner-spin-button,
  &::-webkit-outer-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }

  &::placeholder {
    position: absolute;
    top: 5px;
    left: 3px;
    line-height: inherit;
    color: white;
    opacity: .3;
  }
`;

const StyledCurrency = styled.div`
  margin-left: auto;
  display: flex;
  flex-direction: row;
`;

const CurrencyTitle = styled.span`
  margin-left: 10px;
  cursor: pointer;
  background-color: transparent;
  border: none;
  opacity: 0.5;
  font-size: 20px;
  align-items: center;
`;

const rateStyle = css`
  font-size: 12px;
  align-self: start;
  margin-left: 15px;
`;

// const ErrorStyled = styled.div`
//   position: absolute;
//   top: 33px;
//   left: 0;
//   line-height: 26px;
//   font-size: 13px;
//   color: var(--color-failed);
// `;

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ variant, value, selectedCurrency, error, onChangeHandler, ...rest }, ref) => {
    const handleInput: React.ChangeEventHandler<HTMLInputElement> = (event) => {
      const { value: raw } = event.target;
  
      if (selectedCurrency) {
        console.log()
        const regex = new RegExp("^(?!0\\d)(\\d+)(\\.)?(\\d{0," + selectedCurrency.validator_dec + "})?$");
        if ((raw !== '' && !regex.test(raw)) || parseFloat(raw) > AMOUNT_MAX) {
          return;
        }
      }
  
      onChangeHandler(raw);
    };

    const getCurrIcon = (curr) => {
      const ICONS = {
        usdt: () => (<IconUsdt/>),
        wbtc: () => (<IconWbtc/>),
        dai: () => (<IconDai/>),
        eth: () => (<IconEth/>),
      };

      return ICONS[curr.name.toLowerCase()]()
    }

    return (
      <>
        <ContainerStyled className={variant === 'common' ? AddressInputClass : NumberInputClass}>
          <InputStyled
            variant={variant} ref={ref}
            onInput={handleInput}
            value={value}
            error={error} {...rest} />
          {
            (variant === 'amount' 
              ? (
              <StyledCurrency>
                { getCurrIcon(selectedCurrency) }
                <CurrencyTitle>
                  {selectedCurrency !== null ? selectedCurrency.name : ''}
                </CurrencyTitle>
              </StyledCurrency>
              ) : <></>)
          }
        </ContainerStyled>
        {!error && selectedCurrency && <Rate value={parseFloat(value)} selectedCurrencyId={selectedCurrency.rate_id} className={rateStyle} />}
      </>
    )
  },
);

export default Input;






