import React from 'react';
import { screen, render, cleanup, within, act } from 'testUtils';
import '@testing-library/jest-dom/extend-expect';
import AccountTeamManagementPage from './AccountTeamManagementPage';
import { server } from '../../services/mockServer';
import { waitFor } from '@testing-library/dom';
import * as Auth from '../../context/AuthContext';
import { mockUserStateManager } from 'mocks';

const authSpy = jest.spyOn(Auth, 'useAuth');

jest.mock('../../modules/AccountTeamMembersModal', () => () => null);

describe('AccountTeamManagement Page', () => {
    beforeEach(() => {
        authSpy.mockReturnValue({
            isTeamManager: true,
            managerInTeam: () => jest.fn(),
            userState: mockUserStateManager,
        });

        server.listen();
    });

    afterEach(() => {
        server.resetHandlers();
        cleanup();
    });

    afterAll(() => {
        server.close();
    });

    it('should render child components for members', () => {
        const teamId = '1234';
        const innertab = 'members';
        act(() => {
            render(
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

        expect(screen.getByTestId('AccountTeamMembers')).toBeInTheDocument();
    });
    it('should render child components for notifications', async () => {
        const teamId = '1234';
        const innertab = 'notifications';
        act(() => {
            render(
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

        await waitFor(() => {
            expect(screen.getByTestId('NotificationTab')).toBeInTheDocument();
        });

        expect(within(screen.getByTestId('NotificationTab')).getByText('Email notifications')).toBeInTheDocument();
    });
});
