// @format

import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
// import App from './App';
import {SignUpDialog} from './Intro';
import registerServiceWorker from './registerServiceWorker';

// ReactDOM.render(<App />, document.getElementById('root'));
ReactDOM.render(<SignUpDialog />, document.getElementById('root'));
registerServiceWorker();
