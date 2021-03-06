import 'react-app-polyfill/ie11';
import 'react-app-polyfill/stable';
import 'core-js';
import React from 'react';
import ReactDOM from 'react-dom';
import HDRRouter from './HDRRouter';
// import * as serviceWorker from './serviceWorker';

import './css/custom-css-bootstrap-magic-2020-02-10.css';
import 'react-datepicker/dist/react-datepicker.css';
import './css/styles.scss';

ReactDOM.render(<HDRRouter />, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
// serviceWorker.unregister();
