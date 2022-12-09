import { render } from 'testUtils';
import { teamNotificationsMock } from '../../../test/mocks/teamsServiceMock';
import { EmailList } from './AccountTeamNotificationsConfirmationModal.components';

describe('AccountTeamNotificationsConfirmationModal components', () => {
    describe('EmailList', () => {
        it('Then matches the previous snapshot', () => {
            const wrapper = render(<EmailList notifications={teamNotificationsMock} />);

            expect(wrapper.container).toMatchSnapshot();
        });
    });
});
