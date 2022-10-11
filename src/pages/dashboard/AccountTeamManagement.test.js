import React from 'react';
import { render, screen, cleanup } from 'testUtils';
import '@testing-library/jest-dom/extend-expect';
import { waitFor } from '@testing-library/dom';
import AccountTeamManagement from './AccountTeamManagement';
import { userState } from './mockData';

const forwardRefMock = jest.fn();
const onTeamManagementSaveMock = jest.fn();
const onTeamManagementTabChangeMock = jest.fn();
const onClearInnerTabMock = jest.fn();

describe('should not render tabs', () => {
    render(
        <AccountTeamManagement
            userState={userState}
            team='5fc12be363eaab9e68dae76e'
            innertab=''
            forwardRef={forwardRefMock}
            onTeamManagementSave={onTeamManagementSaveMock}
            onTeamManagementTabChange={onTeamManagementTabChangeMock}
            onClearInnerTab={onClearInnerTabMock}
        />
    );
    it('should not render tabs', () => {
        expect(screen.queryByTestId('members')).toBeNull();
        expect(screen.queryByTestId('notifications')).toBeNull();
    });
});

describe('should render tabs', () => {
    beforeEach(() => {
        render(
            <AccountTeamManagement
                userState={userState}
                team='6107fd7d7cceaa24a67eefe8'
                innertab=''
                forwardRef={forwardRefMock}
                onTeamManagementSave={onTeamManagementSaveMock}
                onTeamManagementTabChange={onTeamManagementTabChangeMock}
                onClearInnerTab={onClearInnerTabMock}
            />
        );
    });

    afterEach(() => {
        cleanup();
    });

    it('should render members tab', () => {
        screen.getByTestId('members').click();
        waitFor(() => {
            expect(onTeamManagementTabChangeMock).toHaveBeenCalledWith('members');
        });
    });
    it('should render notifications tab', () => {
        screen.getByTestId('notifications').click();
        waitFor(() => {
            expect(onTeamManagementTabChangeMock).toHaveBeenCalledWith('notifications');
        });
    });
});
