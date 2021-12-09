import React, { useRef, useState } from 'react';
import { styled } from '@linaria/react';
import { $accounts } from '@state/shared';
import { ActiveAccount, Popup, Button } from '.';
import { useStore } from 'effector-react';
import { IconLogout } from '@app/icons';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 50px;
`;

const Title = styled.h1`
  font-size: 56px;
  font-weight: 900;
  margin-bottom: 50px;
`;

const Window: React.FC<any> = ({
  children,
}) => {
  const rootRef = useRef();
  const account = useStore($accounts);
  const [isPopupVisible, setPopupVisible] = useState(false);

  const cancelPopup = () => {
    setPopupVisible(false);
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
        <Button variant="disconnect" pallete="disconnect" icon={IconLogout}>
          disconnect wallet
        </Button>
      )}
      >
        ---wallet data---
      </Popup>
    </Container>
  );
};

export default Window;
