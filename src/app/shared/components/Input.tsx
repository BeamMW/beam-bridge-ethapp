import React from 'react';
import { styled } from '@linaria/react';
import { css } from '@linaria/core';
import { IconWbtc, IconEth, IconDai, IconUsdt } from '@app/shared/icons';
import { Currency } from '@app/core/types';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: string;
  variant: 'amount' | 'common' | 'fee',
  selectedCurrency?: Currency
}

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

// const ErrorStyled = styled.div`
//   position: absolute;
//   top: 33px;
//   left: 0;
//   line-height: 26px;
//   font-size: 13px;
//   color: var(--color-failed);
// `;



const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ variant, selectedCurrency, error, ...rest }, ref) => {

    const inputChange = (event) => {
      if (selectedCurrency) {
        let value = event.target.value;
        var regex = new RegExp("^\\d*(\\.?\\d{0," + selectedCurrency.validator_dec + "})", "g");
        value = (value.match(regex)[0]) || null;
        event.target.value = value;
      }
    }

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
      <ContainerStyled className={variant === 'common' ? AddressInputClass : NumberInputClass}>
        <InputStyled
          type={variant === 'amount' ? 'number' : 'text'}
          variant={variant} ref={ref}
          onChange={variant === 'amount' || variant === 'fee' ? inputChange : null}
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
    )
  },
);

export default Input;






