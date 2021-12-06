import React, { useEffect } from 'react';
import { styled } from '@linaria/react';
import { formatActiveAddressString } from '@core/utils';
import { getTransactionsListFx, $transactionsList } from '@state/shared';
import { useStore } from 'effector-react';

interface ActiveAccountProps {
  text: string;
}

const AccountStyled = styled.div`
  padding: 11px 30px;
  border-radius: 22.5px;
  border: solid 1px #fff;
  background-color: rgba(255, 255, 255, 0.1);
  align-self: flex-end;
  margin 60px 80px 0 0;
  cursor: pointer
`;

const ActiveAccount: React.FC<ActiveAccountProps> = ({
  text
}) => {
  useEffect(() => {
    getTransactionsListFx(text);
  }, []);
  const transactionsList = useStore($transactionsList);
  const textFormatted = formatActiveAddressString(text);
  console.log(transactionsList)
  return (
  <AccountStyled onClick={() => {navigator.clipboard.writeText(text)}}>
    {textFormatted}
  </AccountStyled>
)};

export default ActiveAccount;
