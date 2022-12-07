import { render, fireEvent } from '@testing-library/react';
import { useAuth } from '../../context/AuthContext';
import GatewayAdvancedSearchDataUtilityWizard from '.';
import { CMS_ACTION_OPEN_COHORT_DISCOVERY_MODAL } from '../../configs/constants';

const mockSetData = jest.fn();
let wrapper;

jest.mock('../../context/CmsContext', () => ({
    ...jest.requireActual('../../context/AuthContext'),
    useCms: () => ({
        setData: mockSetData,
    }),
}));

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

describe('Given the GatewayAdvancedSearchDataUtilityWizard component', () => {
    describe('When it is rendered', () => {
        beforeAll(() => {
            redefineWindow();

            wrapper = render(<GatewayAdvancedSearchDataUtilityWizard />, {
                wrapper: Providers,
            });
        });

        it('Then matches the previous snapshot', async () => {
            expect(wrapper.container).toMatchSnapshot();
        });

        describe('And the user is logged out', () => {
            beforeAll(() => {
                useAuth.mockReturnValue({
                    userState: [
                        {
                            loggedIn: false,
                        },
                    ],
                });

                wrapper.rerender(<GatewayAdvancedSearchDataUtilityWizard />);
            });

            afterAll(() => {
                jest.resetAllMocks();
            });

            describe('And the action is clicked', () => {
                beforeAll(() => {
                    const button = wrapper.getByText(/Sign in to use Cohort Discovery/);

                    fireEvent.click(button);
                });

                it('Then set a cms cookie', async () => {
                    expect(mockSetData).toHaveBeenCalledWith({ action: CMS_ACTION_OPEN_COHORT_DISCOVERY_MODAL });
                });

                it('Then goes to the web subdomain', async () => {
                    expect(window.location.assign).toHaveBeenCalledWith('https://web.www.healthdatagateway.org/search=&tab=datasets');
                });
            });
        });

        describe('And the user is logged in', () => {
            beforeAll(() => {
                useAuth.mockReturnValue({
                    userState: [
                        {
                            loggedIn: true,
                        },
                    ],
                });

                wrapper.rerender(<GatewayAdvancedSearchDataUtilityWizard />);
            });

            afterAll(() => {
                jest.resetAllMocks();
            });

            describe('And the action is clicked', () => {
                beforeAll(() => {
                    const button = wrapper.getByText(/Search using Cohort Discovery/);

                    fireEvent.click(button);
                });

                it('Then set a cms cookie', async () => {
                    expect(mockSetData).toHaveBeenCalledWith({ action: CMS_ACTION_OPEN_COHORT_DISCOVERY_MODAL });
                });

                it('Then goes to the web subdomain', async () => {
                    expect(window.location.assign).toHaveBeenCalledWith('https://web.www.healthdatagateway.org/search=&tab=datasets');
                });
            });
        });
    });
});
