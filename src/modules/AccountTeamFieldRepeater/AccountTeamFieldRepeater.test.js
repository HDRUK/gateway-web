import { testUtils, mocks } from '../../../test';
import AccountTeamFieldRepeater from './AccountTeamFieldRepeater';

import * as Auth from '../../context/AuthContext';

const authSpy = jest.spyOn(Auth, 'useAuth');

describe('AccountTeamFieldRepeater', () => {
    beforeAll(() => {
        authSpy.mockReturnValue({
            userState: mocks.userState.mockUserStateManager,
        });
    });

    it('Then matches the previous snapshot', () => {
        const teamNotificationMock = {
            subscribedEmails: [],
        };
        const wrapper = testUtils.render(
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
