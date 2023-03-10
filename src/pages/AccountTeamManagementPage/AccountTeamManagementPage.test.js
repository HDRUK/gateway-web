import '@testing-library/jest-dom/extend-expect';
import AccountTeamManagementPage from './AccountTeamManagementPage';
import { server } from '../../services/mockServer';
import * as Auth from '../../context/AuthContext';
import { mocks, testUtils } from '../../../test';

const authSpy = jest.spyOn(Auth, 'useAuth');

jest.mock('../../modules/AccountTeamMembersModal', () => () => null);

describe('AccountTeamManagement Page', () => {
    beforeEach(() => {
        authSpy.mockReturnValue({
            userState: mocks.userState.mockUserStateManager,
        });

        server.listen();
    });

    afterEach(() => {
        server.resetHandlers();
        testUtils.cleanup();
    });

    afterAll(() => {
        server.close();
    });

    it('should render child components for members', async () => {
        const teamId = '1234';
        const innertab = 'members';
        testUtils.act(() => {
            testUtils.render(
                <AccountTeamManagementPage
                    teamId={teamId}
                    innerTab={innertab}
                    forwardRef={jest.fn()}
                    onTeamManagementSave={jest.fn()}
                    onTeamManagementTabChange={jest.fn()}
                    onClearInnerTab={jest.fn()}
                />
            );
        });

        await testUtils.waitFor(() => {
            expect(testUtils.screen.getByTestId('AccountTeamMembers')).toBeInTheDocument();
        });
    });
    it('should render child components for notifications', async () => {
        const teamId = '1234';

        testUtils.act(() => {
            testUtils.render(<AccountTeamManagementPage teamId={teamId} forwardRef={jest.fn()} onTeamManagementSave={jest.fn()} />);
        });

        testUtils.fireEvent.click(testUtils.screen.queryByText('Notifications'));

        await testUtils.waitFor(() => {
            expect(testUtils.screen.getByTestId('NotificationTab')).toBeInTheDocument();
        });

        expect(testUtils.within(testUtils.screen.getByTestId('NotificationTab')).getByText('Email notifications')).toBeInTheDocument();
    });
});
