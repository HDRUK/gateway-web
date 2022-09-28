import 'react-app-polyfill/ie11';
import 'react-app-polyfill/stable';
import 'core-js';

import React from 'react';
import ReactDOM from 'react-dom';

import './i18n';

import TagManager from 'react-gtm-module';
import { hotjar } from 'react-hotjar';

import GatewayAdvancedSearchDataUtilityWizard from './cms/GatewayAdvancedSearchDataUtilityWizard';
import GlobalProviders from './GlobalProviders';
import GatewayAdvancedSearchCohortDiscovery from './cms/GatewayAdvancedSearchCohortDiscovery';
import Auth from './Auth';
import httpDefaults from './configs/httpDefaults';
import HDRRouter from './HDRRouter';
import { CmsProvider } from 'context/CmsContext';

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

const cmsData = localStorage.getItem('cmsData');

const rootNode = document.getElementById('root');
const cmsGatewayAdvancedSearchDataUtilityWizard = document.getElementById('cms_GatewayAdvancedSearchDataUtilityWizard');
const cmsGatewayAdvancedCohortDiscovery = document.getElementById('cms_GatewayAdvancedSearchCohortDiscovery');

if (cmsGatewayAdvancedSearchDataUtilityWizard) {
    ReactDOM.render(
        <GlobalProviders>
            <GatewayAdvancedSearchDataUtilityWizard />
        </GlobalProviders>,
        cmsGatewayAdvancedSearchDataUtilityWizard
    );
}

if (cmsGatewayAdvancedCohortDiscovery) {
    ReactDOM.render(
        <GlobalProviders>
            <Auth>
                <GatewayAdvancedSearchCohortDiscovery />
            </Auth>
        </GlobalProviders>,
        cmsGatewayAdvancedCohortDiscovery
    );
}

if (rootNode) {
    ReactDOM.render(
        <GlobalProviders>
            <CmsProvider>
                <Auth showLoader>
                    <HDRRouter />
                </Auth>
            </CmsProvider>
        </GlobalProviders>,
        rootNode
    );
}

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
// serviceWorker.unregister();
