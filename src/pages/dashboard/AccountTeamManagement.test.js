import React from 'react';
import { testUtils } from '../../../test';
import '@testing-library/jest-dom/extend-expect';
import AccountTeamManagement from './AccountTeamManagement';
import { userState } from './mockData';

const forwardRefMock = jest.fn();
const onTeamManagementSaveMock = jest.fn();
const onTeamManagementTabChangeMock = jest.fn();
const onClearInnerTabMock = jest.fn();

describe('should not render tabs', () => {
    testUtils.render(
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
        expect(testUtils.screen.queryByTestId('members')).toBeNull();
        expect(testUtils.screen.queryByTestId('notifications')).toBeNull();
    });
});

describe('should render tabs', () => {
    beforeEach(() => {
        testUtils.render(
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
        testUtils.cleanup();
    });

    it('should render members tab', () => {
        testUtils.screen.getByTestId('members').click();
        testUtils.waitFor(() => {
            expect(onTeamManagementTabChangeMock).toHaveBeenCalledWith('members');
        });
    });
    it('should render notifications tab', () => {
        testUtils.screen.getByTestId('notifications').click();
        testUtils.waitFor(() => {
            expect(onTeamManagementTabChangeMock).toHaveBeenCalledWith('notifications');
        });
    });
});
