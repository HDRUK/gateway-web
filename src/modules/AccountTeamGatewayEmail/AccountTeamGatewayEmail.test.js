import React from 'react';
import { screen, render, cleanup } from 'testUtils';
import '@testing-library/jest-dom/extend-expect';
import AccountTeamGatewayEmail from './AccountTeamGatewayEmail';
import { userStateNonManager, userStateManager } from 'mocks';

describe('AccountTeamGatewayEmail', () => {
    afterEach(() => {
        cleanup();
    });

    const memberNotification = { optIn: true, notificationType: 'notifictionType1' };
    const teamId = '1234';
    const togglePersonalNotifications = jest.fn();

    it('should not render additional instruction if user does not have manager role', () => {
        render(
            <AccountTeamGatewayEmail
                togglePersonalNotifications={togglePersonalNotifications}
                memberNotification={memberNotification}
                teamId={teamId}
                userState={userStateNonManager}
            />
        );

        expect(
            screen.queryByText(
                'You will need to add a team email to be able to save switching off notifications to your own Gateway email.'
            )
        ).not.toBeInTheDocument();
    });
    it('should render additional instruction if user has manager role', () => {
        render(
            <AccountTeamGatewayEmail
                togglePersonalNotifications={togglePersonalNotifications}
                memberNotification={memberNotification}
                teamId={teamId}
                userState={userStateManager}
            />
        );

        expect(
            screen.getByText('You will need to add a team email to be able to save switching off notifications to your own Gateway email.')
        ).toBeInTheDocument();
    });
    it('should call toggle function if switch is changed', () => {
        render(
            <AccountTeamGatewayEmail
                togglePersonalNotifications={togglePersonalNotifications}
                memberNotification={memberNotification}
                teamId={teamId}
                userState={userStateManager}
            />
        );

        screen.getByRole('switch').click();
        expect(togglePersonalNotifications).toHaveBeenCalledWith(false, expect.anything(), 'notifictionType1');
    });
    it('should render readOnly email address', () => {
        render(
            <AccountTeamGatewayEmail
                togglePersonalNotifications={togglePersonalNotifications}
                memberNotification={memberNotification}
                teamId={teamId}
                userState={userStateManager}
            />
        );

        const emailInput = screen.getByDisplayValue('dan@ackroyd.com');
        expect(emailInput).toBeInTheDocument();
        expect(emailInput).toHaveProperty('readOnly');
    });
});
