import React, { useEffect } from 'react';
import { useStore } from 'effector-react';
import { $isNetworkCorrect, $view } from '@state/shared';
import { initApp } from '@state/init';
import { useNavigate, useRoutes } from 'react-router-dom';
import { getRateFx } from '@state/shared';
import { Balance, Receive, Send, Connect } from '@app/pages/main';

import './styles';
import { NetworkAlert } from './pages/shared';

const routes = [
  {
    path: '/',
    element: <Balance />,
  },
  {
    path: `send/:address`,
    element: <Send />,
  },
  {
    path: `send/*`,
    element: <Send />,
  },
  {
    path: `receive/*`,
    element: <Receive />
  }, 
  {
    path: `connect/*`,
    element: <Connect />
  }
];

const App = () => {
  const navigateURL = useStore($view);
  const isNetworkIsCorrect = useStore($isNetworkCorrect);

  useEffect(() => {
    initApp();
    getRateFx();
  }, []);

  useEffect(() => {
    navigate(navigateURL);
  }, [navigateURL]);

  const content = useRoutes(routes);
  const navigate = useNavigate();

  return (
      <>
        {content}
        {!isNetworkIsCorrect ? <NetworkAlert/> : <></>}
      </>
  );
};

export default App;
