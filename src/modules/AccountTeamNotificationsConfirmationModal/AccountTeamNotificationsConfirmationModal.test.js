import { testUtils } from '../../../test';
import { teamNotificationsMock } from '../../../test/mocks/teamsServiceMock';
import AccountTeamNotificationsConfirmationModal from './AccountTeamNotificationsConfirmationModal';

describe('AccountTeamNotificationsConfirmationModal', () => {
    afterEach(() => {
        testUtils.cleanup();
    });
    it('Then matches the previous snapshot', () => {
        const wrapper = testUtils.render(
            <AccountTeamNotificationsConfirmationModal
                isOpen
                onClose={jest.fn()}
                onConfirm={jest.fn()}
                teamNotifications={teamNotificationsMock}
            />
        );

        expect(wrapper.container).toMatchSnapshot();
    });
    it('should call onConfirm when saving', () => {
        const onCloseMock = jest.fn();
        const onConfirmMock = jest.fn();

        testUtils.render(
            <AccountTeamNotificationsConfirmationModal
                isOpen
                onClose={onCloseMock}
                onConfirm={onConfirmMock}
                teamNotifications={teamNotificationsMock}
            />
        );

        const saveButton = testUtils.screen.getByText('Save update');
        saveButton.click();
        expect(onConfirmMock).toHaveBeenCalled();
    });
    it('should call onClose when cancelling', () => {
        const onCloseMock = jest.fn();
        const onConfirmMock = jest.fn();

        testUtils.render(
            <AccountTeamNotificationsConfirmationModal
                isOpen
                onClose={onCloseMock}
                onConfirm={onConfirmMock}
                teamNotifications={teamNotificationsMock}
            />
        );

        const noButton = testUtils.screen.getByText('No, nevermind');
        noButton.click();
        expect(onCloseMock).toHaveBeenCalled();
    });
});
