import React from 'react';
import { render } from 'testUtils';
import AccountTeamFieldRepeater from './AccountTeamFieldRepeater';
import { mockUserStateManager } from 'mocks';
import * as Auth from '../../context/AuthContext';

const authSpy = jest.spyOn(Auth, 'useAuth');

describe('AccountTeamFieldRepeater', () => {
    beforeAll(() => {
        authSpy.mockReturnValue({
            isTeamManager: false,
            managerInTeam: jest.fn(),
            userState: mockUserStateManager,
        });
    });

    it('Then matches the previous snapshot', () => {
        const teamNotificationMock = {
            subscribedEmails: [],
        };
        const wrapper = render(
            <AccountTeamFieldRepeater
                id='1'
                teamId='1234'
                handleFieldChange={jest.fn()}
                handleRemoveClick={jest.fn()}
                handleAddClick={jest.fn()}
                teamNotification={teamNotificationMock}
            />
        );

        expect(wrapper.container).toMatchSnapshot();
    });
});
