import React from 'react';
import { styled } from '@linaria/react';
import { css } from '@linaria/core';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Button, Window, InstallPopup } from '@app/shared/components';
import { IconMetamask } from '@app/shared/icons';
import { connectToMetamask } from '@app/core/api';
import { selectPopupsState } from '../../store/selectors';
import { setPopupState } from '../../store/actions';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const Title = styled.h1`
  margin-top: 240px
  font-size: 56px;
  font-weight: 900;
`;

const Subtitle = styled.h2`
  margin-top: 30px;
  font-size: 24px;
  text-align: center;
`;

const connectButtonClass = css`
  margin-top: 50px !important;
`;

const ButtonTextClass = css`
  float: right;
  margin-top: 10px;
`;

const Connect: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const popupsState = useSelector(selectPopupsState());

  return (
    <>
      <Window state="content">
        <Container>
          <Title>ETH to BEAM Bridge</Title>
          <Subtitle>
            Transfer ETH, BTC, DAI and USDT.<br/>
            More tokens coming soon!
          </Subtitle>
          <Button icon={IconMetamask}
            pallete="white"
            variant="connect"
            onClick={connectToMetamask}>
              CONNECT WALLET
            </Button>
        </Container>
        <InstallPopup visible={popupsState.install} onCancel={()=>{
          dispatch(setPopupState({type: 'install', state: false}));
        }}/>
      </Window>
    </>
  );
};

export default Connect;
