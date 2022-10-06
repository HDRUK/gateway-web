import React, { Suspense } from 'react';
import { render } from '@testing-library/react';
import { ThemeProvider } from '@emotion/react';
import { DEFAULT_THEME } from 'hdruk-react-core';
import { merge } from 'lodash';
import PropTypes from 'prop-types';
import { I18nextProvider } from 'react-i18next';
import { QueryClient, QueryClientProvider } from 'react-query';
import { AuthProvider } from '../src/context/AuthContext';
import { theme } from '../src/configs/theme';
import { CmsProvider } from '../src/context/CmsContext';
import i18n from '../src/i18n';
import { mockUser } from '../src/services/auth/mockData';

const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            retry: false,
        },
    },
});

const AllTheProviders = ({ children }) => {
    return (
        <I18nextProvider i18n={i18n}>
            <Suspense fallback='Loading'>
                <ThemeProvider theme={merge(theme, DEFAULT_THEME)}>
                    <AuthProvider value={{ userState: mockUser.data }}>
                        <QueryClientProvider client={queryClient}>
                            <CmsProvider>{children}</CmsProvider>
                        </QueryClientProvider>
                    </AuthProvider>
                </ThemeProvider>
            </Suspense>
        </I18nextProvider>
    );
};

AllTheProviders.propTypes = {
    children: PropTypes.node.isRequired,
};

const customRender = (ui, options) => render(ui, { wrapper: AllTheProviders, ...options });

const createPortalContainer = () => {
    const div = document.createElement('div');
    document.body.appendChild(div);

    return div;
};

const removePortalContainer = div => {
    div.parentNode.removeChild(div);
};

export * from '@testing-library/react';

export { customRender as render, createPortalContainer, removePortalContainer };
