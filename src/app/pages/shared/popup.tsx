import React from 'react';
import { styled } from '@linaria/react';
import { IconClose } from '@app/icons';

import { css } from '@linaria/core';
import Backdrop from './backdrop';
import Button from './button';

interface PopupProps {
  title?: string;
  cancelButton?: React.ReactElement;
  confirmButton?: React.ReactElement;
  visible?: boolean;
  onCancel?: React.MouseEventHandler;
}

const ContainerStyled = styled.div`
  transform: translateX(-50%) translateY(-50%);
  position: absolute;
  top: 50%;
  left: 50%;
  width: 660px;
  padding: 30px 30px 50px 50px;
  border-radius: 10px;
  background-color: var(--color-popup);
  text-align: center;
  color: white;
  display: flex;
  flex-direction: column;
`;

const TitleStyled = styled.h2`
  font-size: 16px;
  margin: 0;
  margin-bottom: 20px;
`;

const FooterStyled = styled.div`
  display: flex;
  margin: 50px auto 0 auto;
`;

const IconCloseClass = css`
  margin-left: auto;
`;

const Popup: React.FC<PopupProps> = ({
  title,
  visible,
  onCancel,
  confirmButton,
  children,
}) => (visible ? (
  <Backdrop onCancel={onCancel}>
    <ContainerStyled>
      <IconClose className={IconCloseClass}/>
      <TitleStyled>{title}</TitleStyled>
      {children}
      <FooterStyled>
        {confirmButton}
      </FooterStyled>
    </ContainerStyled>
  </Backdrop>
) : null);

export default Popup;
