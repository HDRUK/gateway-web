import { ThemeProvider } from '@emotion/react';
import '@testing-library/jest-dom';
import * as rtl from '@testing-library/react';
import { renderHook } from '@testing-library/react-hooks';
import Enzyme, { mount, render, shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import React, { Suspense } from 'react';
import { I18nextProvider } from 'react-i18next';
import { QueryClient, QueryClientProvider } from 'react-query';
import 'regenerator-runtime/runtime';
import { AuthProvider } from './context/AuthContext';
import i18n from './i18n';
import { mockUser } from './services/auth/mockData';
import { theme } from './configs/theme';
import 'jest-date-mock';
import { DEFAULT_THEME } from 'hdruk-react-core';
import { merge } from 'lodash';
import { CmsProvider } from './context/CmsContext';

Enzyme.configure({
    adapter: new Adapter(),
});

global.React = React;
global.shallow = shallow;
global.render = render;
global.mount = mount;
global.fireEvent = rtl.fireEvent;

global.assertServiceMutateAsyncCalledWithDifferentArgs = async (rendered, mock, mutateArgs, spyArgs) => {
    const { waitFor, result } = rendered;

    await waitFor(() => result.current.mutateAsync);

    result.current.mutateAsync(mutateArgs).then(() => {
        expect(mock).toHaveBeenCalledWith(spyArgs);
    });
};

global.assertServiceMutateAsyncCalled = async (rendered, mock, ...args) => {
    const { waitFor, result } = rendered;

    await waitFor(() => result.current.mutateAsync);

    result.current.mutateAsync(args).then(() => {
        expect(mock).toHaveBeenCalledWith(args);
    });
};

global.assertServiceMutateAsyncCalledWithArgs = async (rendered, mock, asyncArgs, serviceArgs) => {
    const { waitFor, result } = rendered;

    await waitFor(() => result.current.mutateAsync);

    result.current.mutateAsync(asyncArgs).then(() => {
        expect(mock).toHaveBeenCalledWith(serviceArgs);
    });
};

global.assertServiceRefetchCalled = async (rendered, mock, ...args) => {
    const { waitFor, result } = rendered;

    await waitFor(() => result.current.refetch);

    result.current.refetch(args).then(() => {
        expect(mock).toHaveBeenCalledWith(args);
    });
};

global.redefineWindow = () => {
    const oldWindowLocation = window.location;

    delete window.location;

    window.location = Object.defineProperties(
        {},
        {
            ...Object.getOwnPropertyDescriptors(oldWindowLocation),
            assign: {
                configurable: true,
                value: jest.fn(),
            },
            hostname: {
                value: 'web.www.healthdatagateway.org',
            },
        }
    );
};

const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            retry: false,
        },
    },
});

global.Providers = ({ children }) => {
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

global.renderHook = renderHook;

global.document.createRange = () => ({
    setStart: () => {},
    setEnd: () => {},
    commonAncestorContainer: {
        nodeName: 'BODY',
        ownerDocument: document,
    },
});

// global.console = {
// 	log: console.log,
// 	error: jest.fn(),
// 	warn: jest.fn(),
// 	info: console.info,
// 	debug: console.debug,
// };

Object.defineProperty(window, 'location', {
    writable: true,
    value: { href: 'https://www.healthdatagateway.org', assign: jest.fn() },
});
