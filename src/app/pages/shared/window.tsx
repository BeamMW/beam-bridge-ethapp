import React, { useRef, useState } from 'react';
import { styled } from '@linaria/react';
import { $accounts, $balance } from '@state/shared';
import { ActiveAccount, Popup, Button, TokenCard } from '.';
import { useStore } from 'effector-react';
import { IconLogout, IconCopyWhite } from '@app/icons';
import { css } from '@linaria/core';
import MetaMaskController from '@core/MetaMask';

const metaMaskController = MetaMaskController.getInstance();

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 50px !important;
`;

const Title = styled.h1`
  font-size: 56px;
  font-weight: 900;
  margin-bottom: 50px;
`;

const PopupSubtitle = styled.div`
  font-size: 14px;
  font-weight: bold;
  letter-spacing: 2.63px;
  margin-top: 30px;
`;

const PopupAccount = styled.div`
  margin-top: 20px;
  font-size: 14px;
  line-height: 1.43;
  display: flex;
  flex-direction: raw;
`;

const CopyAccountClass = css`
  margin-left: 30px;
  cursor: pointer;
`;

const PopupCards = styled.div`
  margin-top: 20px;
  display: flex;
  width: 100%;
  flex-wrap: wrap
  justify-content: space-between;
`;

const Window: React.FC<any> = ({
  children,
}) => {
  const rootRef = useRef();
  const account = useStore($accounts);
  const balance = useStore($balance);
  const [isPopupVisible, setPopupVisible] = useState(false);

  const cancelPopup = () => {
    setPopupVisible(false);
  }

  const handleCopyClick: React.MouseEventHandler = () => {
    navigator.clipboard.writeText(account[0]);
  };

  const disconnectWalletClicked: React.MouseEventHandler = async () => {
    metaMaskController.disconnect();
  }

  return (
    <Container ref={rootRef}>
      <ActiveAccount text={account[0]} onClick={()=>{setPopupVisible(true)}}></ActiveAccount>
      <Title>Ethereum to Beam Bridge</Title>
      { children }
      <Popup
      visible={isPopupVisible}
      onCancel={cancelPopup}
      title="Your wallet"
      confirmButton={(
        <Button onClick={disconnectWalletClicked} pallete="disconnect" variant="darkest_blue" icon={IconLogout}>
          disconnect wallet
        </Button>
      )}
      >
        <PopupSubtitle>ETHEREUM BRIDGE ADDRESS</PopupSubtitle>
        <PopupAccount>
          <span>{account[0]}</span>
          <IconCopyWhite onClick={handleCopyClick} className={CopyAccountClass}/>
        </PopupAccount>
        <PopupSubtitle>SUPPORTED TOKENS</PopupSubtitle>
        <PopupCards>
          { balance.map(({ curr_id, rate_id, value, icon, is_approved }) => (
            <TokenCard icon={icon} 
              curr_id={curr_id}
              key={curr_id}
              rate_id={rate_id}
              type={icon}
              balanceValue={value}
              is_approved={is_approved}
            ></TokenCard>
          ))}
        </PopupCards>
      </Popup>
    </Container>
  );
};

export default Window;
