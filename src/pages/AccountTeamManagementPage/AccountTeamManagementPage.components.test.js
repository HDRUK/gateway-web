import { screen, render, cleanup, waitFor } from 'testUtils';
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
import { mocks } from '../../../test';
import * as Auth from '../../context/AuthContext';

const authSpy = jest.spyOn(Auth, 'useAuth');

describe('AccountTeamManagement components', () => {
    beforeAll(() => {
        authSpy.mockReturnValue({
            userState: mocks.userState.mockUserStateManager,
        });
    });
    afterEach(() => {
        cleanup();
    });
    describe('MemberNotifications', () => {
        const memberNotifications = [{ optIn: true, notificationType: 'notifictionType1' }];
        const teamId = '1234';
        const togglePersonalNotifications = jest.fn();

        it('should not render component if there are no member notifications', () => {
            render(
                <MemberNotifications
                    togglePersonalNotifications={togglePersonalNotifications}
                    memberNotifications={[]}
                    teamId={teamId}
                    userState={mocks.userState.mockUserStateManager}
                />
            );

            expect(screen.queryByTestId('MemberNotifications')).not.toBeInTheDocument();
        });
        it('should render component if there are no notifications', () => {
            render(
                <MemberNotifications
                    togglePersonalNotifications={togglePersonalNotifications}
                    memberNotifications={memberNotifications}
                    teamId={teamId}
                    userState={mocks.userState.mockUserStateManager}
                />
            );

            expect(screen.getByTestId('MemberNotifications')).toBeInTheDocument();
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
            render(
                <TeamNotifications
                    teamGatewayNotifications={[]}
                    teamId={teamId}
                    toggleTeamNotifications={toggleTeamNotifications}
                    handleFieldChange={handleFieldChange}
                    handleRemoveClick={handleRemoveClick}
                    handleAddClick={handleAddClick}
                    userState={mocks.userState.mockUserStateManager}
                />
            );
            expect(screen.queryByTestId('TeamNotifications')).not.toBeInTheDocument();
        });
        it('should render component if there are no member notifications', () => {
            render(
                <TeamNotifications
                    teamGatewayNotifications={teamGatewayNotifications}
                    teamId={teamId}
                    toggleTeamNotifications={toggleTeamNotifications}
                    handleFieldChange={handleFieldChange}
                    handleRemoveClick={handleRemoveClick}
                    handleAddClick={handleAddClick}
                    userState={mocks.userState.mockUserStateManager}
                />
            );
            expect(screen.getByTestId('TeamNotifications')).toBeInTheDocument();
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
            render(
                <NotificationTab
                    memberNotifications={memberNotifications}
                    teamId={teamId}
                    userState={mocks.userState.mockUserStateManager}
                    togglePersonalNotifications={jest.fn()}
                    teamGatewayNotifications={teamGatewayNotifications}
                    toggleTeamNotifications={jest.fn()}
                    handleFieldChange={jest.fn()}
                    handleRemoveClick={jest.fn()}
                    handleAddClick={jest.fn()}
                />
            );

            expect(screen.getByText('Email notifications')).toBeInTheDocument();
            expect(screen.getByText('Send email notifications to my Gateway email address')).toBeInTheDocument();
            expect(screen.getByText('Send email notifications to team email address')).toBeInTheDocument();
        });
    });

    describe('EmailNotificationsHeader', () => {
        it('should ', () => {
            render(<EmailNotificationsHeader />);
            expect(screen.getByText('Email notifications')).toBeInTheDocument();
            expect(
                screen.getByText(
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
            render(<TabsNav teamId={teamId} onTabChange={onTabChange} activeTabKey={activeTabKey} />);
            await waitFor(() => {
                expect(screen.getByText('Members')).toBeInTheDocument();
                expect(screen.getByText('Notifications')).toBeInTheDocument();
            });
        });
        it('should not render the tabs if admin', async () => {
            authSpy.mockReturnValue({
                userState: mocks.userState.mockUserStateAdmin,
            });
            render(
                <TabsNav
                    teamId='5f7b1a2bce9f65e2ed83e7da'
                    onTabChange={onTabChange}
                    activeTabKey={activeTabKey}
                    userState={mocks.userState.mockUserStateAdmin}
                />
            );
            await waitFor(() => {
                expect(screen.queryByText('Members')).not.toBeInTheDocument();
                expect(screen.queryByText('Notifications')).not.toBeInTheDocument();
            });
        });
    });

    describe('TeamManagementHeader', () => {
        it('should render correct title and description', () => {
            render(<TeamManagementHeader />);
            expect(screen.getByText('Team management')).toBeInTheDocument();
            expect(
                screen.getByText(
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
            render(<GeneratedAlerts alerts={alerts} />);
            expect(screen.getByText('success message')).toBeInTheDocument();
            expect(screen.getByText('warning message')).toBeInTheDocument();
        });
    });

    describe('LoaderRow', () => {
        it('should render loader', () => {
            render(<LoaderRow />);
            expect(screen.getByText('Loading...')).toBeInTheDocument();
        });
    });
});
