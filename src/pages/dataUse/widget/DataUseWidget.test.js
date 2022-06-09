import '@testing-library/jest-dom/extend-expect';
import { render, screen } from '@testing-library/react';
import React from 'react';
import DataUseWidget from './DataUseWidget';

let wrapper;

describe('Given the DataUseWidget component', () => {
    describe('When it is rendered', () => {
        beforeAll(() => {
            wrapper = render(<DataUseWidget publisherName='Test Custodian' />, {
                wrapper: Providers,
            });
        });

        it('Then matches the previous snapshot', () => {
            expect(wrapper.container).toMatchSnapshot();
        });

        it('Then Title and description should be rendered', async () => {
            expect(screen.queryByText('How to start using your widget')).toBeTruthy();
            expect(
                screen.queryByText(
                    "Below is an interactive example of how your widget could look and be used. Please note that this design is compatible with mobile devices and can be resized to fit anywhere on your website. To start using this widget please accept the terms and conditions by clicking on the 'Get widget' button below."
                )
            ).toBeTruthy();
        });
    });
});
