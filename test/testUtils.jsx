import React from 'react';
import { render } from '@testing-library/react';
import { ThemeProvider } from '@emotion/react';
import { DEFAULT_THEME } from 'hdruk-react-core';
import { merge } from 'lodash';
import PropTypes from 'prop-types';
import { theme } from '../src/configs/theme';

const AllTheProviders = ({ children }) => {
    return <ThemeProvider theme={merge(theme, DEFAULT_THEME)}>{children}</ThemeProvider>;
};

AllTheProviders.propTypes = {
    children: PropTypes.node.isRequired,
};

const customRender = (ui, options) => render(ui, { wrapper: AllTheProviders, ...options });

export * from '@testing-library/react';

export { customRender as render };
