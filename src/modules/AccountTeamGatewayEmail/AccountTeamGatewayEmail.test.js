import React from 'react';
import { screen, render, cleanup } from 'testUtils';
import '@testing-library/jest-dom/extend-expect';
import AccountTeamGatewayEmail from './AccountTeamGatewayEmail';
import * as Auth from '../../context/AuthContext';
import { userStateNonManager, userStateManager } from 'mocks';

const authSpy = jest.spyOn(Auth, 'useAuth');

const managerInTeamMock = jest.fn();

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
                isTeamManager: false,
                managerInTeam: managerInTeamMock,
                userState: userStateManager,
            });

            wrapper = render(<AccountTeamGatewayEmail {...props} />);
        });

        it('Then should match the snapshot', () => {
            expect(wrapper.container).toMatchSnapshot();
        });

        it('Then should check the user is a manager', () => {
            expect(managerInTeamMock).toHaveBeenCalled();
        });

        it('Then should set the correct email', () => {
            const emailInput = screen.getByDisplayValue('dan@ackroyd.com');
            expect(emailInput).toHaveProperty('disabled');
        });

        it('Then should set the toggle correctly', () => {
            const checkbox = screen.getByRole('checkbox', { hidden: true });

            expect(checkbox.checked).toBe(false);
        });

        describe('And the user is a manager', () => {
            beforeAll(() => {
                authSpy.mockReturnValue({
                    isTeamManager: true,
                    managerInTeam: managerInTeamMock,
                    userState: userStateManager,
                });

                wrapper.rerender(<AccountTeamGatewayEmail {...props} />);
            });

            it('Then should match the snapshot', () => {
                expect(wrapper.container).toMatchSnapshot();
            });

            it('Then should render the correct message', () => {
                expect(
                    screen.queryByText(
                        /You will need to add a team email to be able to save switching off notifications to your own Gateway email/
                    )
                ).toBeTruthy();
            });
        });

        describe('And the user is not a manager', () => {
            beforeAll(() => {
                authSpy.mockReturnValue({
                    isTeamManager: false,
                    managerInTeam: jest.fn(),
                    userState: userStateManager,
                });

                wrapper.rerender(<AccountTeamGatewayEmail {...props} />);
            });

            it('Then should not render the managers message', () => {
                expect(
                    screen.queryByText(
                        /You will need to add a team email to be able to save switching off notifications to your own Gateway email/
                    )
                ).not.toBeInTheDocument();
            });
        });

        describe('And optIn is clicked', () => {
            beforeAll(() => {
                screen.getByRole('checkbox', { hidden: true }).click();
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
                    const checkbox = screen.getByRole('checkbox', { hidden: true });

                    expect(checkbox.checked).toBe(true);
                });
            });
        });
    });
});
