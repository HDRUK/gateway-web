import { fireEvent, render, waitFor, screen } from 'testUtils';
import React from 'react';
import AdvancedSearchCohortDiscovery from '.';
import { ADVANCED_SEARCH_ROLE_GENERAL_ACCESS } from '../../../configs/constants';
import { server } from '../../../services/mockServer';

jest.mock('../../dashboard/AdvancedSearchTAndCsModal', () => ({ updateUserAcceptedAdvancedSearchTerms }) => {
    return <button onClick={updateUserAcceptedAdvancedSearchTerms}>Yes, I agree</button>;
});

const mockShowLogin = jest.fn();
const mockOnClick = jest.fn();

const props = {
    userProps: {
        id: '1234',
        loggedIn: false,
        advancedSearchRoles: [],
        acceptedAdvancedSearchTerms: false,
    },
    showLoginModal: mockShowLogin,
    variant: 'vertical',
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
            wrapper = render(<AdvancedSearchCohortDiscovery {...props} />);
        });

        it('Then shows a learn more link', async () => {
            await waitFor(() => expect(screen.getByText('Learn more')).toBeTruthy());
        });

        describe('And the action is clicked', () => {
            beforeEach(() => {
                const button = screen.getByText('Sign in to use Cohort Discovery');

                button.click();
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
                    />
                );
            });

            describe('And the action is clicked', () => {
                beforeAll(() => {
                    const button = screen.getByText('Search using Cohort Discovery');

                    button.click();
                });

                it('Then shows the terms and conditions modal', async () => {
                    await waitFor(() => expect(wrapper.getByText('Access to Cohort Discovery')).toBeTruthy());
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
                        />
                    );
                });

                describe('And the action is clicked', () => {
                    beforeAll(() => {
                        const button = screen.getByText('Search using Cohort Discovery');

                        button.click();
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
                                const button = screen.getByTestId('accepted-action');

                                button.click();
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

        describe('And onClick is supplied', () => {
            beforeAll(() => {
                wrapper.rerender(<AdvancedSearchCohortDiscovery {...props} onClick={mockOnClick} />);
            });

            describe('And the action is clicked', () => {
                beforeEach(() => {
                    const button = screen.getByText('Sign in to use Cohort Discovery');

                    button.click();
                });

                it('Then calls onClick', async () => {
                    await waitFor(() => expect(mockOnClick).toHaveBeenCalled());
                });
            });
        });
    });
});
