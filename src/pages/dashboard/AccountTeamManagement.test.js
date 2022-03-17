import React from 'react';
import { render, fireEvent, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import AccountTeamManagement from './AccountTeamManagement';
import { userState } from './__tests__/mockData';
import { tabTypes } from './Team/teamUtil';

const forwardRefMock = jest.fn();
const onTeamManagementSaveMock = jest.fn();
const onTeamManagementTabChangeMock = jest.fn();
const onClearInnerTabMock = jest.fn();

test('should not render Member,Notifications and Teams Tab', async () => {
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
    Object.keys(tabTypes).map(key => {
        expect(screen.queryByTestId(tabTypes[key])).toBeNull();
    });
});

test('should render Member,Notifications and Teams Tab', async () => {
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
    Object.keys(tabTypes).map(key => {
        expect(screen.getByTestId(tabTypes[key])).toBeInTheDocument();
        fireEvent.click(screen.getByTestId(tabTypes[key]));
        expect(onTeamManagementTabChangeMock).toHaveBeenCalledTimes(1);
    });
});
