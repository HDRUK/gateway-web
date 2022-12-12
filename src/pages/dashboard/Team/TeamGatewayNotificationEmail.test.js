import { render, rerender, waitFor, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import userEvent from '@testing-library/user-event';
import React from 'react';
import TeamGatewayNotificationEmails from './TeamGatewayNotificationEmails';
import { server } from '../../../services/mockServer';
const props = {
    teamNotification: {
        notificationType: 'dataAccessRequest',
        optIn: true,
        subscribedEmails: [
            {
                value: 'test.com',
                error: '',
            },
        ],
    },
    teamId: '123456',
    userHasRole: jest.fn().mockReturnValue(false),
    toggleTeamNotifications: jest.fn(),
};

describe('Given the TeamGatewayNotificationEmails component', () => {
    describe('When it is rendered and isManager is false', () => {
        let wrapper;
        beforeAll(() => {
            server.listen();
            wrapper = render(<TeamGatewayNotificationEmails {...props} />, {
                wrapper: Providers,
            });
        });

        afterAll(() => {
            server.close();
        });

        it('Opt in Switch Icon should not be rendered', async () => {
            expect(wrapper.queryByTestId('notify-team-email')).toBeNull();
        });

        it('Then the "Send email notifications to team email address" should not be rendered', async () => {
            await waitFor(() => expect(wrapper.queryByText('Send email notifications to team email address')).toBeNull());
        });
    });
    describe('When it is rendered and isManager is true', () => {
        let wrapper;

        beforeAll(() => {
            server.listen();
            wrapper = render(<TeamGatewayNotificationEmails {...props} userHasRole={jest.fn().mockReturnValue(true)} />, {
                wrapper: Providers,
            });
        });

        afterAll(() => {
            server.close();
        });

        it('Should match the snapshot', async () => {
            expect(wrapper.container).toMatchSnapshot();
        });

        it('Opt in Switch Icon should  be rendered', async () => {
            expect(wrapper.getByTestId('notify-team-email')).toBeTruthy();
        });

        it('Then the "Send email notifications to team email address" should be rendered', async () => {
            await waitFor(() => expect(wrapper.queryByText('Send email notifications to team email address')).toBeTruthy());
        });

        it('toggle Opt in Switch', async () => {
            fireEvent.click(wrapper.getByTestId('notify-team-email'));
            expect(props.toggleTeamNotifications.mock.calls.length).toBe(1);
            expect(props.toggleTeamNotifications.mock.calls[0][0]).toBe(false);
            fireEvent.click(wrapper.getByTestId('notify-team-email'));
            expect(props.toggleTeamNotifications.mock.calls.length).toBe(2);
        });
    });
});
