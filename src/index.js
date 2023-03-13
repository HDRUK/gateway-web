import 'react-app-polyfill/ie11';
import 'react-app-polyfill/stable';
import 'core-js';

import ReactDOM from 'react-dom';

import './i18n';

import TagManager from 'react-gtm-module';
import { hotjar } from 'react-hotjar';

import GlobalProviders from './GlobalProviders';
import Auth from './Auth';
import httpDefaults from './configs/httpDefaults';
import HDRRouter from './HDRRouter';
import GatewayAdvancedSearchBanner from './cms/GatewayAdvancedSearchBanner';

if (process.env.REACT_APP_HOTJAR_CODE && process.env.REACT_APP_HOTJAR_CODE_VERSION) {
    hotjar.initialize(process.env.REACT_APP_HOTJAR_CODE, process.env.REACT_APP_HOTJAR_CODE_VERSION);
}

if (window.gtmId && window.gaConsent === true) {
    const tagManagerArgs = {
        gtmId: window.gtmId,
    };
    TagManager.initialize(tagManagerArgs);
}

httpDefaults();

const rootNode = document.getElementById('root');
const gatewayAdvancedSearchBanner = document.getElementById('gateway_AdvancedSearchBanner');

if (gatewayAdvancedSearchBanner) {
    ReactDOM.render(
        <GlobalProviders>
            <Auth>
                <GatewayAdvancedSearchBanner />
            </Auth>
        </GlobalProviders>,
        gatewayAdvancedSearchBanner
    );
}

if (rootNode) {
    ReactDOM.render(
        <GlobalProviders>
            <Auth showLoader>
                <HDRRouter />
            </Auth>
        </GlobalProviders>,
        rootNode
    );
}

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
// serviceWorker.unregister();
