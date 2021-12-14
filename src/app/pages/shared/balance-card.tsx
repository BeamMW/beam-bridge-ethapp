import React from 'react';
import { styled } from '@linaria/react';
import { $rate } from '@state/shared';
import { useStore } from 'effector-react';
import { Button } from '.';
import { isNil } from '@app/core/utils';
import { IconUsdt, IconWbtc, IconDai, IconEth } from '@app/icons';
import MetaMaskController from '@core/MetaMask';

const metaMaskController = MetaMaskController.getInstance();

interface CardProps {
  balanceValue?: number,
  type?: string,
  rate_id: string,
  curr_id: number,
  icon: string,
  is_approved: boolean
}
const CardStyled = styled.div<CardProps>`
  width: 100%;
  height: 75px;
  margin-top: 10px
  padding: 20px;
  border-radius: 10px;
  background-image: linear-gradient(99deg, 
    ${({ type }) => `var(--color-${type.toLowerCase()}-from)`} 2%, rgb(0, 69, 143, .3) 99%);
  display: flex;
  flex-direction: row;
  align-items: center;
`;

const LogoStyled = styled.object`
  display: block;
`;

const BalanceStyled = styled.span`
  margin-left: 10px;
  display: relative;
`;

const BalanceValue = styled.div`
  font-size: 16px;
  font-weight: 600;
`;

const BalanceRate = styled.div`
  opacity: 0.7;
  font-size: 12px;
  margin-top: 1px;
`;

const StyledApproveButton = styled.span`
  width: 175px;
  height: 37px;
  margin-left: auto;
`;

const ICONS = {
  usdt: () => (<IconUsdt/>),
  wbtc: () => (<IconWbtc/>),
  dai: () => (<IconDai/>),
  eth: () => (<IconEth/>),
};

const Card: React.FC<CardProps> = ({
  children,
  balanceValue,
  rate_id,
  curr_id,
  type,
  is_approved,
  icon,
  ...rest
}) => {
  const rates = useStore($rate);
  const currency = type.toUpperCase();

  const approveTokenClicked = (id: number) => {
    metaMaskController.approveToken(id);
  }

  return (<CardStyled is_approved={is_approved} icon={icon} curr_id={curr_id} rate_id={rate_id} type={type} {...rest}>
      { ICONS[icon]() }
      <BalanceStyled>
        <BalanceValue>{balanceValue} {currency}</BalanceValue>
        <BalanceRate>{`${!isNil(rates) ? balanceValue * rates[rate_id].usd : 0} USD`}</BalanceRate>
      </BalanceStyled>
      {!is_approved ? (
      <StyledApproveButton>
        <Button variant='validate' onClick={()=>approveTokenClicked(curr_id)}>approve token</Button>
      </StyledApproveButton>
      ) : <></>}
    </CardStyled>
  )
};

export default Card;
