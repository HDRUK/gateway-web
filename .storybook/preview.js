/** @jsx jsx */
import { jsx, ThemeProvider } from '@emotion/react';
import { Suspense } from 'react';
import { I18nextProvider } from 'react-i18next';
import { theme } from '../src/configs/theme';
import i18n from '../src/i18n';

export const parameters = {
	actions: { argTypesRegex: '^on[A-Z].*' },
	controls: {
		matchers: {
			color: /(background|color)$/i,
			date: /Date$/,
		},
	},
};

export const decorators = [
	Story => (
		<Suspense fallback='Loading'>
			<ThemeProvider theme={theme}>
				<I18nextProvider i18n={i18n}>
					<div className='sb-preview-padded'>
						<Story />
					</div>
				</I18nextProvider>
			</ThemeProvider>
		</Suspense>
	),
];

import './main.scss';
