import React, { Suspense } from 'react';
import { QueryClient, QueryClientProvider } from 'react-query';
import PropTypes from 'prop-types';
import { ThemeProvider } from '@emotion/react';
import { DEFAULT_THEME } from 'hdruk-react-core';
import * as Sentry from '@sentry/react';
import { merge } from 'lodash';
import { createBrowserHistory } from 'history';
import { BrowserRouter as Router } from 'react-router-dom';
import { Integrations } from '@sentry/tracing';
import { theme } from './configs/theme';

const history = createBrowserHistory();
const urlEnv = require('./pages/commonComponents/BaseURL').getURLEnv();

Sentry.init({
    dsn: 'https://c7c564a153884dc0a6b676943b172121@o444579.ingest.sentry.io/5419637',
    environment: urlEnv,
    integrations: [
        new Integrations.BrowserTracing({
            routingInstrumentation: Sentry.reactRouterV5Instrumentation(history),
        }),
    ],
    tracesSampleRate: 1.0,
});

const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            refetchOnWindowFocus: false,
        },
    },
});

const GlobalProviders = ({ children }) => {
    return (
        <Suspense fallback={''}>
            <QueryClientProvider client={queryClient}>
                <ThemeProvider theme={merge(theme, DEFAULT_THEME)}>
                    <Router history={history}>{children}</Router>
                </ThemeProvider>
            </QueryClientProvider>
        </Suspense>
    );
};

GlobalProviders.propTypes = {
    children: PropTypes.node.isRequired,
};

export default GlobalProviders;
