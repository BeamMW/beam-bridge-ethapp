import * as React from 'react';
import * as ReactDOM from 'react-dom';

import { BrowserRouter as Router } from 'react-router-dom';

import 'babel-polyfill';

import App from './app';

window.global = window;

ReactDOM.render(
    <Router>
      <App />
    </Router>,
    document.getElementById('root'),
  );
