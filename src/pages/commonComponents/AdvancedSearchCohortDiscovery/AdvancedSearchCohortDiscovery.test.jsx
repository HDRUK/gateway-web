import { fireEvent, render, waitFor } from '@testing-library/react';
import React from 'react';
import AdvancedSearchCohortDiscovery from '.';
import { ADVANCED_SEARCH_ROLE_GENERAL_ACCESS } from '../../../configs/constants';
import { server } from '../../../services/mockServer';

jest.mock('../../dashboard/AdvancedSearchTAndCsModal', () => ({ updateUserAcceptedAdvancedSearchTerms }) => {
    return <button onClick={updateUserAcceptedAdvancedSearchTerms}>Yes, I agree</button>;
});

const mockShowLogin = jest.fn();

const props = {
    userProps: {
        id: '1234',
        loggedIn: false,
        advancedSearchRoles: [],
        acceptedAdvancedSearchTerms: false,
    },
    showLoginModal: mockShowLogin,
};

let wrapper;

describe('Given the AdvancedSearchCohortDiscovery component', () => {
    beforeAll(() => {
        server.listen();

        redefineWindow();
    });

    afterEach(() => {
        server.resetHandlers();

        jest.resetAllMocks();
    });

    afterAll(() => {
        server.close();
    });

    describe('When it is rendered', () => {
        beforeAll(() => {
            wrapper = render(<AdvancedSearchCohortDiscovery {...props} />, {
                wrapper: Providers,
            });
        });

        it('Then shows a learn more link', async () => {
            await waitFor(() => expect(wrapper.getByText('Learn more')).toBeTruthy());
        });

        describe('And the action is clicked', () => {
            beforeEach(() => {
                const button = wrapper.getByText('Sign in to use Cohort Discovery');

                fireEvent.click(button);
            });

            it('Then matches the previous snapshot', async () => {
                expect(wrapper.container).toMatchSnapshot();
            });

            it('Then shows the login modal', async () => {
                await waitFor(() => expect(props.showLoginModal).toHaveBeenCalled());
            });
        });

        describe('And the user is logged in', () => {
            beforeAll(() => {
                wrapper.rerender(
                    <AdvancedSearchCohortDiscovery
                        {...props}
                        userProps={{
                            ...props.userProps,
                            loggedIn: true,
                        }}
                    />,
                    {
                        wrapper: Providers,
                    }
                );
            });

            describe('And the action is clicked', () => {
                beforeAll(() => {
                    const button = wrapper.getByText('Search using Cohort Discovery');

                    fireEvent.click(button);
                });

                it('Then shows the terms and conditions modal', async () => {
                    await waitFor(() => expect(wrapper.getByText('How to access the advanced search tool')).toBeTruthy());
                });
            });

            describe('And the user is valid', () => {
                beforeAll(() => {
                    wrapper.rerender(
                        <AdvancedSearchCohortDiscovery
                            {...props}
                            userProps={{
                                ...props.userProps,
                                loggedIn: true,
                                advancedSearchRoles: [ADVANCED_SEARCH_ROLE_GENERAL_ACCESS],
                            }}
                        />,
                        {
                            wrapper: Providers,
                        }
                    );
                });

                describe('And the action is clicked', () => {
                    beforeAll(() => {
                        const button = wrapper.getByText('Search using Cohort Discovery');

                        fireEvent.click(button);
                    });

                    it('Then shows the terms and conditions modal', async () => {
                        await waitFor(() => expect(wrapper.getByText('Yes, I agree')).toBeTruthy());
                    });

                    describe('And the Form is submitted', () => {
                        beforeAll(async () => {
                            fireEvent.click(wrapper.getByText(/Yes, I agree/i));
                        });

                        it('Then has the correct action', async () => {
                            await waitFor(() => expect(wrapper.getByTestId('accepted-action')).toBeTruthy());
                        });

                        describe('And the action is clicked', () => {
                            beforeEach(() => {
                                const button = wrapper.getByTestId('accepted-action');

                                fireEvent.click(button);
                            });

                            it('Then redirects to the correct place', async () => {
                                await waitFor(() =>
                                    expect(window.location.assign).toHaveBeenCalledWith(
                                        'https://rquest.test.healthdatagateway.org/bcrquest/'
                                    )
                                );
                            });
                        });
                    });
                });
            });
        });
    });
});
