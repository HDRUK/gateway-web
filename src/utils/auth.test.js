import { getTeamRoleNames, userHasTeamRole, getIsTeamAdmin, isTeamAdminNotManager } from './auth';

describe('Given the auth helpers', () => {
    const userStateMock = [
        {
            teams: [
                { _id: '1111', roles: ['manager'], isAdmin: true },
                { _id: '2222', roles: ['reviewer'], isAdmin: true },
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
    describe('When getTeamRoleNames is called', () => {
        it('Then returns the correct value', () => {
            expect(getTeamRoleNames(['manager', 'metadata_editor'])).toEqual('Manager, Metadata Editor');
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
});
