import React from 'react';
import { screen, render, cleanup, within, act } from 'testUtils';
import '@testing-library/jest-dom/extend-expect';
import AccountTeamManagementPage from './AccountTeamManagementPage';
import { userStateManager } from 'mocks';
import { server } from '../../services/mockServer';
import { waitFor } from '@testing-library/dom';

jest.mock('../../context/AuthContext', () => ({
    ...jest.requireActual('../../context/AuthContext'),
    useAuth: jest.fn().mockReturnValue({
        isTeamManager: false,
        managerInTeam: jest.fn(),
    }),
}));

jest.mock('../../modules/AccountTeamMembersModal', () => () => null);

describe('AccountTeamManagement Page', () => {
    beforeAll(() => {
        server.listen();
    });

    afterEach(() => {
        server.resetHandlers();
    });

    afterAll(() => {
        server.close();
    });
    afterEach(() => {
        cleanup();
    });
    it('should render child components for members', () => {
        const teamId = '5f7b1a2bce9f65e6ed83e7da';
        const innertab = 'members';
        act(() => {
            render(
                <AccountTeamManagementPage
                    userState={userStateManager}
                    teamId={teamId}
                    innerTab={innertab}
                    forwardRef={jest.fn()}
                    onTeamManagementSave={jest.fn()}
                    onTeamManagementTabChange={jest.fn()}
                    onClearInnerTab={jest.fn()}
                />
            );
        });

        const memberTabContent = screen.getByTestId('AccountTeamMembers');
        expect(within(memberTabContent).getByText('Members')).toBeInTheDocument();
    });
    it('should render child components for notifications', async () => {
        const teamId = '5f7b1a2bce9f65e6ed83e7da';
        const innertab = 'notifications';
        act(() => {
            render(
                <AccountTeamManagementPage
                    userState={userStateManager}
                    teamId={teamId}
                    innerTab={innertab}
                    forwardRef={jest.fn()}
                    onTeamManagementSave={jest.fn()}
                    onTeamManagementTabChange={jest.fn()}
                    onClearInnerTab={jest.fn()}
                />
            );
        });

        await waitFor(() => {
            expect(screen.getByTestId('NotificationTab')).toBeInTheDocument();
        });

        expect(within(screen.getByTestId('NotificationTab')).getByText('Email notifications')).toBeInTheDocument();
    });
});
