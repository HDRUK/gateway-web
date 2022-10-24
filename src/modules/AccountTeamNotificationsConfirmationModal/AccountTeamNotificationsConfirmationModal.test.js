import React from 'react';
import { render } from 'testUtils';
import { teamNotificationsMock } from '../../../test/mocks/teamsServiceMock';
import AccountTeamNotificationsConfirmationModal from './AccountTeamNotificationsConfirmationModal';

describe('AccountTeamNotificationsConfirmationModal', () => {
    it('Then matches the previous snapshot', () => {
        const wrapper = render(
            <AccountTeamNotificationsConfirmationModal close={jest.fn()} confirm={jest.fn()} teamNotifications={teamNotificationsMock} />
        );

        expect(wrapper.container).toMatchSnapshot();
    });
});
