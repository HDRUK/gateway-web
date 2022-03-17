import 'react-app-polyfill/ie11';
import 'react-app-polyfill/stable';
import 'core-js';
import React from 'react';
import ReactDOM from 'react-dom';

import './css/custom-css-bootstrap-magic-2020-02-10.css';
import 'react-datepicker/dist/react-datepicker.css';
import './css/styles.scss';
import 'react-notifications/lib/notifications.css';

import './i18n';

import TagManager from 'react-gtm-module';
import { hotjar } from 'react-hotjar';
import HDRRouter from './HDRRouter';

if (process.env.REACT_APP_HOTJAR_CODE && process.env.REACT_APP_HOTJAR_CODE_VERSION) {
    hotjar.initialize(process.env.REACT_APP_HOTJAR_CODE, process.env.REACT_APP_HOTJAR_CODE_VERSION);
}

if (window.gtmId && window.gaConsent === true) {
    const tagManagerArgs = {
        gtmId: window.gtmId,
    };
    TagManager.initialize(tagManagerArgs);
}

ReactDOM.render(<HDRRouter />, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
// serviceWorker.unregister();
