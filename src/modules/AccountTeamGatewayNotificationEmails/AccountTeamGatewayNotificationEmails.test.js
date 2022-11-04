import React from 'react';
import { screen, render, cleanup } from 'testUtils';
import '@testing-library/jest-dom/extend-expect';
import AccountTeamGatewayNotificationEmails from './AccountTeamGatewayNotificationEmails';
import * as Auth from '../../context/AuthContext';
import { mockUserStateAdmin, mockUserStateManager } from '../../../test/mocks';

const authSpy = jest.spyOn(Auth, 'useAuth');

const managerInTeamMock = jest.fn();
const toggleTeamNotificationsMock = jest.fn();

const props = {
    teamNotification: { optIn: false, notificationType: 'notifictionType1' },
    teamId: '1234',
    toggleTeamNotifications: toggleTeamNotificationsMock,
};

let wrapper;

describe('Given the AccountTeamGatewayNotificationEmails component', () => {
    describe('When it renders', () => {
        describe('And the user is not a manager', () => {
            beforeAll(() => {
                authSpy.mockReturnValue({
                    userState: mockUserStateAdmin,
                });

                wrapper = render(<AccountTeamGatewayNotificationEmails {...props} />);
            });

            afterAll(() => {
                cleanup();
            });

            it('Then should be empty', () => {
                expect(wrapper.container).toBeEmpty();
            });
        });

        describe('And the user is a manager', () => {
            beforeEach(() => {
                authSpy.mockReturnValue({
                    userState: mockUserStateManager,
                });

                render(<AccountTeamGatewayNotificationEmails {...props} />);
            });

            afterEach(() => {
                cleanup();
            });

            it('Then should render the form label', () => {
                expect(screen.getByLabelText('Send email notifications to team email address')).toBeInTheDocument();
            });

            it('Then should call the correct method', () => {
                screen.getByRole('checkbox', { hidden: true }).click();
                expect(toggleTeamNotificationsMock).toHaveBeenCalledWith({ checked: true, id: 'notifictionType1' });
            });
        });
    });
});
