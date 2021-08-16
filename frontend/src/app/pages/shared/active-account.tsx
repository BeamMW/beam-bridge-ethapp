import React from 'react';
import { styled } from '@linaria/react';

interface ButtonProps {
  type?: 'submit' | 'reset' | 'button';
  color?: 'primary' | 'ghost';
}

const AccountStyled = styled.div<ButtonProps>`
  padding: 11px 30px;
  border-radius: 22.5px;
  border: solid 1px #fff;
  background-color: rgba(255, 255, 255, 0.1);
  align-self: flex-end;
  margin 80px 80px 0 0;
`;

const ActiveAccount = () => {
  return (
    <AccountStyled>
      1Cs4wu…uzbg9t
    </AccountStyled>
  );
};

export default ActiveAccount;
