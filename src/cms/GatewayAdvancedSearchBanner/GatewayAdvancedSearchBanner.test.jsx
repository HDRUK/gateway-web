import React from 'react';
import { render } from '@testing-library/react';
import GatewayAdvancedSearchBanner from '.';

let wrapper;

jest.mock('../../context/AuthContext', () => ({
    ...jest.requireActual('../../context/AuthContext'),
    useAuth: jest.fn().mockReturnValue({
        userState: [
            {
                loggedIn: false,
            },
        ],
    }),
}));

describe('Given the GatewayAdvancedSearchBanner component', () => {
    describe('When it is rendered', () => {
        beforeAll(() => {
            redefineWindow();

            wrapper = render(<GatewayAdvancedSearchBanner />, {
                wrapper: Providers,
            });
        });

        it('Then matches the previous snapshot', async () => {
            expect(wrapper.container).toMatchSnapshot();
        });

        it('Then has the cohort discovery box', () => {
            expect(wrapper.getByText('Cohort Discovery')).toBeTruthy();
        });

        it('Then has the data utility box', () => {
            expect(wrapper.getByText('Data Utility Wizard')).toBeTruthy();
        });
    });
});
