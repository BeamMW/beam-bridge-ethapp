import React, { HTMLAttributes } from 'react';
import { styled } from '@linaria/react';
import { isNil } from '@core/utils';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: string;
}

const ContainerStyled = styled.div`
  position: relative;
`;

const InputStyled = styled.input<InputProps>`
  width: 100%;
  height: 44px;
  line-height: 20px;

  border: none;
  background-color: rgba(255, 255, 255, .05);
  font-size: 16px;
  color: white;
  border-radius: 10px;
  margin-top: 20px;

  // &::placeholder {
  //   position: absolute;
  //   top: 0;
  //   left: 3px;
  //   line-height: inherit;
  //   color: white;
  //   opacity: 0.5;
  // }
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
  ({ error, ...rest }, ref) => (
    <ContainerStyled>
      <InputStyled ref={ref} error={error} {...rest} />
      {/* {!isNil(error) && <ErrorStyled>{error}</ErrorStyled>} */}
    </ContainerStyled>
  ),
);

export default Input;
