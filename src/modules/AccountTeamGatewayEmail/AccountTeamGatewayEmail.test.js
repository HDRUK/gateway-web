import { testUtils, mocks } from '../../../test';
import '@testing-library/jest-dom/extend-expect';
import AccountTeamGatewayEmail from './AccountTeamGatewayEmail';
import * as Auth from '../../context/AuthContext';

const authSpy = jest.spyOn(Auth, 'useAuth');

const props = {
    memberNotification: { optIn: false, notificationType: 'notifictionType1' },
    teamId: '1234',
    togglePersonalNotifications: jest.fn(),
};

let wrapper;

describe('Given the AccountTeamGatewayEmail component', () => {
    describe('When it renders', () => {
        beforeAll(() => {
            authSpy.mockReturnValue({
                userState: mocks.userState.mockUserStateNonManager,
            });

            wrapper = testUtils.render(<AccountTeamGatewayEmail {...props} />);
        });

        it('Then should match the snapshot', async () => {
            await testUtils.waitFor(() => {
                expect(wrapper.container).toMatchSnapshot();
            });
        });

        it('Then should set the correct email', () => {
            const emailInput = testUtils.screen.getByDisplayValue('john@candy.com');
            expect(emailInput).toHaveProperty('disabled');
        });

        it('Then should set the toggle correctly', () => {
            const checkbox = testUtils.screen.getByRole('checkbox', { hidden: true });

            expect(checkbox.checked).toBe(false);
        });

        describe('And the user is a manager', () => {
            beforeAll(() => {
                authSpy.mockReturnValue({
                    userState: mocks.userState.mockUserStateManager,
                });

                wrapper.rerender(<AccountTeamGatewayEmail {...props} />);
            });

            it('Then should match the snapshot', () => {
                expect(wrapper.container).toMatchSnapshot();
            });

            it('Then should render the correct message', () => {
                expect(
                    testUtils.screen.queryByText(
                        /You will need to add a team email to be able to save switching off notifications to your own Gateway email/
                    )
                ).toBeTruthy();
            });
        });

        describe('And the user is not a manager', () => {
            beforeAll(() => {
                authSpy.mockReturnValue({
                    userState: mocks.userState.mockUserStateManager,
                });

                wrapper.rerender(<AccountTeamGatewayEmail {...props} />);
            });

            it('Then should not render the managers message', async () => {
                testUtils.waitFor(() => {
                    expect(
                        testUtils.screen.queryByText(
                            /You will need to add a team email to be able to save switching off notifications to your own Gateway email/
                        )
                    ).not.toBeInTheDocument();
                });
            });
        });

        describe('And optIn is clicked', () => {
            beforeAll(() => {
                testUtils.screen.getByRole('checkbox', { hidden: true }).click();
            });

            it('Then should call the correct method', () => {
                expect(props.togglePersonalNotifications).toHaveBeenCalled();
            });

            describe('And optIn is true', () => {
                beforeAll(() => {
                    wrapper.rerender(
                        <AccountTeamGatewayEmail {...props} memberNotification={{ optIn: true, notificationType: 'notifictionType1' }} />
                    );
                });

                it('Then should check the toggle', () => {
                    const checkbox = testUtils.screen.getByRole('checkbox', { hidden: true });

                    expect(checkbox.checked).toBe(true);
                });
            });
        });
    });
});
