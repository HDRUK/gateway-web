import '@testing-library/jest-dom/extend-expect';
import {
    MemberNotifications,
    TeamNotifications,
    NotificationTab,
    EmailNotificationsHeader,
    TabsNav,
    TeamManagementHeader,
    GeneratedAlerts,
    LoaderRow,
} from './AccountTeamManagementPage.components';
import { mocks, testUtils } from '../../../test';
import * as Auth from '../../context/AuthContext';

const authSpy = jest.spyOn(Auth, 'useAuth');

describe('AccountTeamManagement components', () => {
    beforeAll(() => {
        authSpy.mockReturnValue({
            userState: mocks.userState.mockCustodianTeamAdmin,
        });
    });
    afterEach(() => {
        testUtils.cleanup();
    });
    describe('MemberNotifications', () => {
        const memberNotifications = [{ optIn: true, notificationType: 'notifictionType1' }];
        const teamId = '1234';
        const togglePersonalNotifications = jest.fn();

        it('should not render component if there are no member notifications', () => {
            testUtils.render(
                <MemberNotifications
                    togglePersonalNotifications={togglePersonalNotifications}
                    memberNotifications={[]}
                    teamId={teamId}
                    userState={mocks.userState.mockCustodianTeamAdmin}
                />
            );

            expect(testUtils.screen.queryByTestId('MemberNotifications')).not.toBeInTheDocument();
        });
        it('should render component if there are no notifications', () => {
            testUtils.render(
                <MemberNotifications
                    togglePersonalNotifications={togglePersonalNotifications}
                    memberNotifications={memberNotifications}
                    teamId={teamId}
                    userState={mocks.userState.mockCustodianTeamAdmin}
                />
            );

            expect(testUtils.screen.getByTestId('MemberNotifications')).toBeInTheDocument();
        });
    });

    describe('TeamNotifications', () => {
        const teamGatewayNotifications = [
            {
                subscribedEmails: [{ value: 'mock value', error: 'mock error' }],
                optIn: true,
                notificationType: 'notificationType1',
            },
        ];
        const teamId = '1234';
        const toggleTeamNotifications = jest.fn();
        const handleFieldChange = jest.fn();
        const handleRemoveClick = jest.fn();
        const handleAddClick = jest.fn();
        it('should not render component if there are no member notifications', () => {
            testUtils.render(
                <TeamNotifications
                    teamGatewayNotifications={[]}
                    teamId={teamId}
                    toggleTeamNotifications={toggleTeamNotifications}
                    handleFieldChange={handleFieldChange}
                    handleRemoveClick={handleRemoveClick}
                    handleAddClick={handleAddClick}
                    userState={mocks.userState.mockCustodianTeamAdmin}
                />
            );
            expect(testUtils.screen.queryByTestId('TeamNotifications')).not.toBeInTheDocument();
        });
        it('should render component if there are no member notifications', () => {
            testUtils.render(
                <TeamNotifications
                    teamGatewayNotifications={teamGatewayNotifications}
                    teamId={teamId}
                    toggleTeamNotifications={toggleTeamNotifications}
                    handleFieldChange={handleFieldChange}
                    handleRemoveClick={handleRemoveClick}
                    handleAddClick={handleAddClick}
                    userState={mocks.userState.mockCustodianTeamAdmin}
                />
            );
            expect(testUtils.screen.getByTestId('TeamNotifications')).toBeInTheDocument();
        });
    });

    describe('NotificationTab', () => {
        const memberNotifications = [{ optIn: true, notificationType: 'notifictionType1' }];
        const teamGatewayNotifications = [
            {
                subscribedEmails: [{ value: 'mock value', error: 'mock error' }],
                optIn: true,
                notificationType: 'notificationType1',
            },
        ];
        const teamId = '1234';
        it('should render content within child components', () => {
            testUtils.render(
                <NotificationTab
                    memberNotifications={memberNotifications}
                    teamId={teamId}
                    userState={mocks.userState.mockCustodianTeamAdmin}
                    togglePersonalNotifications={jest.fn()}
                    teamGatewayNotifications={teamGatewayNotifications}
                    toggleTeamNotifications={jest.fn()}
                    handleFieldChange={jest.fn()}
                    handleRemoveClick={jest.fn()}
                    handleAddClick={jest.fn()}
                />
            );

            expect(testUtils.screen.getByText('Email notifications')).toBeInTheDocument();
            expect(testUtils.screen.getByText('Send email notifications to my Gateway email address')).toBeInTheDocument();
            expect(testUtils.screen.getByText('Send email notifications to team email address')).toBeInTheDocument();
        });
    });

    describe('EmailNotificationsHeader', () => {
        it('should ', () => {
            testUtils.render(<EmailNotificationsHeader />);
            expect(testUtils.screen.getByText('Email notifications')).toBeInTheDocument();
            expect(
                testUtils.screen.getByText(
                    'Team related email notifications will automatically be sent to each team members Gateway log in email. Data custodian managers can choose to send notifications to additional email accounts.'
                )
            ).toBeInTheDocument();
        });
    });

    describe('TabsNav', () => {
        const activeTabKey = 'notifications';
        const onTabChange = jest.fn();
        const teamId = '1234';
        it('should render the tabs if not admin', async () => {
            testUtils.render(<TabsNav teamId={teamId} onTabChange={onTabChange} activeTabKey={activeTabKey} />);
            await testUtils.waitFor(() => {
                expect(testUtils.screen.getByText('Members')).toBeInTheDocument();
                expect(testUtils.screen.getByText('Notifications')).toBeInTheDocument();
            });
        });
    });

    describe('TeamManagementHeader', () => {
        it('should render correct title and description', () => {
            testUtils.render(<TeamManagementHeader />);
            expect(testUtils.screen.getByText('Team management')).toBeInTheDocument();
            expect(
                testUtils.screen.getByText(
                    'Organise and manage team members and the teams email notifications. If you need assistance managing the team, please',
                    { exact: false }
                )
            ).toBeInTheDocument();
        });
    });

    describe('GeneratedAlerts', () => {
        it('should render list of alerts', () => {
            const alerts = [
                { type: 'success', message: 'success message' },
                { type: 'warning', message: 'warning message' },
            ];
            testUtils.render(<GeneratedAlerts alerts={alerts} />);
            expect(testUtils.screen.getByText('success message')).toBeInTheDocument();
            expect(testUtils.screen.getByText('warning message')).toBeInTheDocument();
        });
    });

    describe('LoaderRow', () => {
        it('should render loader', () => {
            testUtils.render(<LoaderRow />);
            expect(testUtils.screen.getByText('Loading...')).toBeInTheDocument();
        });
    });
});
