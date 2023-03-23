import {
    ROLE_CUSTODIAN_DAR_MANAGER,
    ROLE_CUSTODIAN_DAR_REVIEWER,
    ROLE_CUSTODIAN_METADATA_EDITOR,
    ROLE_CUSTODIAN_METADATA_MANAGER,
    ROLE_CUSTODIAN_TEAM_ADMIN,
} from 'consts';
import { userHasTeamRole, getIsTeamAdmin, isTeamAdminNotManager, getCustodianTeamAdmins } from './auth';

describe('Given the auth helpers', () => {
    const userStateMock = [
        {
            teams: [
                { _id: '1111', roles: ['manager'], isAdmin: true },
                { _id: '2222', roles: ['reviewer'], isAdmin: true, type: "admin" },
                { _id: '3333', roles: ['reviewer', 'manager'] },
                { _id: '4444', roles: ['manager'], isAdmin: false },
                { _id: '5555', roles: ['reviewer'], isAdmin: false },
            ],
        },
    ];
    describe('When isTeamAdminNotManager is called', () => {
        it('Then returns true if admin and not manager', () => {
            const teamIdMock = '2222';
            expect(isTeamAdminNotManager(teamIdMock, userStateMock)).toBeTruthy();
        });
        it('Then returns false if admin and manager', () => {
            const teamIdMock = '1111';
            expect(isTeamAdminNotManager(teamIdMock, userStateMock)).toBeFalsy();
        });
        it('Then returns false if not admin and is manager', () => {
            const teamIdMock = '4444';
            expect(isTeamAdminNotManager(teamIdMock, userStateMock)).toBeFalsy();
        });
        it('Then returns false if not admin and not manager', () => {
            const teamIdMock = '5555';
            expect(isTeamAdminNotManager(teamIdMock, userStateMock)).toBeFalsy();
        });
    });
    describe('When getIsTeamAdmin is called', () => {
        it('Then returns false if not admin', () => {
            const teamIdMock = '2222';
            expect(getIsTeamAdmin(userStateMock, teamIdMock)).toBeTruthy();
        });
        it('Then returns true if admin', () => {
            const teamIdMock = '4444';
            expect(getIsTeamAdmin(userStateMock, teamIdMock)).toBeFalsy();
        });
    });
    describe('When userHasTeamRole is called', () => {
        it('should be truthy as the user has a role which matches', () => {
            const teamIdMock = '2222';
            expect(userHasTeamRole(userStateMock, teamIdMock, ['reviewer'])).toBeTruthy();
        });
        it('should accept a string as the role and be truthy as the user has a role which matches', () => {
            const teamIdMock = '2222';
            expect(userHasTeamRole(userStateMock, teamIdMock, 'reviewer')).toBeTruthy();
        });
        it('should be truthy as the user has a role which matches', () => {
            const teamIdMock = '2222';
            expect(userHasTeamRole(userStateMock, teamIdMock, ['manager'])).toBeFalsy();
        });
        it('should accept a string as the role and be falsy as the user does not have a role which matches', () => {
            const teamIdMock = '2222';
            expect(userHasTeamRole(userStateMock, teamIdMock, 'manager')).toBeFalsy();
        });
        it('should be truthy as the user has at least one role which matches', () => {
            const teamIdMock = '3333';
            expect(userHasTeamRole(userStateMock, teamIdMock, ['reviewer', 'editor'])).toBeTruthy();
        });
    });
    describe('When getCustodianTeamAdmins is called', () => {
        it('should return just team admins', () => {
            const teamMock = {
                members: [
                    { roles: [ROLE_CUSTODIAN_TEAM_ADMIN], memberid: '1111' },
                    { roles: [ROLE_CUSTODIAN_DAR_MANAGER], memberid: '2222' },
                    { roles: [ROLE_CUSTODIAN_DAR_REVIEWER], memberid: '3333' },
                    { roles: [ROLE_CUSTODIAN_METADATA_MANAGER], memberid: '4444' },
                    { roles: [ROLE_CUSTODIAN_METADATA_EDITOR], memberid: '5555' },
                    { roles: [ROLE_CUSTODIAN_TEAM_ADMIN, ROLE_CUSTODIAN_METADATA_EDITOR], memberid: '6666' },
                ],
                users: [
                    { firstname: 'John', _id: '1111' },
                    { firstname: 'Dan', _id: '2222' },
                    { firstname: 'Chevy', _id: '3333' },
                    { firstname: 'Martin', _id: '4444' },
                    { firstname: 'Leslie', _id: '5555' },
                    { firstname: 'Eddie', _id: '6666' },
                ],
            };
            expect(getCustodianTeamAdmins(teamMock)).toEqual([
                { firstname: 'John', _id: '1111' },
                { firstname: 'Dan', _id: '2222' },
                { firstname: 'Martin', _id: '4444' },
                { firstname: 'Eddie', _id: '6666' },
            ]);
        });
    });
});
