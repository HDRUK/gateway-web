import 'react-app-polyfill/ie11';
import 'react-app-polyfill/stable';
import 'core-js';
import React from 'react';
import ReactDOM from 'react-dom';
import * as Sentry from '@sentry/react';
import HDRRouter from './HDRRouter';
// import * as serviceWorker from './serviceWorker';

import './css/custom-css-bootstrap-magic-2020-02-10.css';
import 'react-datepicker/dist/react-datepicker.css';
import './css/styles.scss';

const urlEnv = require('./pages/commonComponents/BaseURL').getURLEnv();

// TODO: Revisit using sentry's dialog feedback

if (urlEnv !== 'local') {
	Sentry.init({
		dsn: 'https://c7c564a153884dc0a6b676943b172121@o444579.ingest.sentry.io/5419637',
		environment: urlEnv,
		/* beforeSend(event, hint) {
		    if(event.exception) {
		        Sentry.showReportDialog({ eventId: event.event_id });
            }
		    return event;
        }, */
	});
}

ReactDOM.render(<HDRRouter />, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
// serviceWorker.unregister();
