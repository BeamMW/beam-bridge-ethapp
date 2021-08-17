import React from 'react';
import { styled } from '@linaria/react';

interface ActiveAccountProps {
  text: string;
}

const AccountStyled = styled.div`
  padding: 11px 30px;
  border-radius: 22.5px;
  border: solid 1px #fff;
  background-color: rgba(255, 255, 255, 0.1);
  align-self: flex-end;
  margin 80px 80px 0 0;
`;

const ActiveAccount: React.FC<ActiveAccountProps> = ({
  text
}) => (
  <AccountStyled>
    {text}
  </AccountStyled>
);

export default ActiveAccount;
