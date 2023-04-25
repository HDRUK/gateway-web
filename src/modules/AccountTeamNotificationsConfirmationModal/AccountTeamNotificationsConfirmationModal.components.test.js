import { testUtils } from '../../../test';
import { teamNotificationsMock } from '../../../test/mocks/teamsServiceMock';
import { EmailList } from './AccountTeamNotificationsConfirmationModal.components';

describe('AccountTeamNotificationsConfirmationModal components', () => {
    describe('EmailList', () => {
        it('Then matches the previous snapshot', () => {
            const wrapper = testUtils.render(<EmailList notifications={teamNotificationsMock} />);

            expect(wrapper.container).toMatchSnapshot();
        });
    });
});
