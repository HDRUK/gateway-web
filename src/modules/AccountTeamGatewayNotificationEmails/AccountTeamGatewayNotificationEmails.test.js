import { testUtils, mocks } from '../../../test';
import '@testing-library/jest-dom/extend-expect';
import AccountTeamGatewayNotificationEmails from './AccountTeamGatewayNotificationEmails';
import * as Auth from '../../context/AuthContext';

const authSpy = jest.spyOn(Auth, 'useAuth');

const toggleTeamNotificationsMock = jest.fn();

const props = {
    teamNotification: { optIn: false, notificationType: 'notifictionType1' },
    teamId: '1234',
    toggleTeamNotifications: toggleTeamNotificationsMock,
};

describe('Given the AccountTeamGatewayNotificationEmails component', () => {
    describe('When it renders', () => {
        describe('And the user is not a team admin', () => {
            beforeAll(() => {
                authSpy.mockReturnValue({
                    userState: mocks.userState.mockCustodianMetadataManager,
                });

                testUtils.render(<AccountTeamGatewayNotificationEmails {...props} />);
            });

            afterAll(() => {
                testUtils.cleanup();
            });

            it('Then should be empty', () => {
                expect(testUtils.screen.getByLabelText('Send email notifications to team email address')).toBeDisabled();
            });
        });

        describe('And the user is a team admin', () => {
            beforeEach(() => {
                authSpy.mockReturnValue({
                    userState: mocks.userState.mockCustodianTeamAdmin,
                });

                testUtils.render(<AccountTeamGatewayNotificationEmails {...props} />);
            });

            afterEach(() => {
                testUtils.cleanup();
            });

            it('Then should render the form label', () => {
                expect(testUtils.screen.getByLabelText('Send email notifications to team email address')).toBeInTheDocument();
            });

            it('Then should call the correct method', () => {
                testUtils.screen.getByRole('checkbox', { hidden: true }).click();
                expect(toggleTeamNotificationsMock).toHaveBeenCalledWith({ checked: true, id: 'notifictionType1' });
            });
        });
    });
});
