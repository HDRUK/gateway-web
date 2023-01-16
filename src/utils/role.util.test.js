import { PERMISSIONS_TEAM_ROLES, ROLE_CUSTODIAN_DAR_MANAGER, ROLE_CUSTODIAN_METADATA_MANAGER, ROLE_CUSTODIAN_TEAM_ADMIN } from 'consts';
import { getIsTeamAdmin, getIsTeamAdminOrManager } from './role.util';

describe('role Util', () => {
    describe('getIsTeamAdmin', () => {
        it('should return true if team admin', () => {
            const mockTeam = { roles: [ROLE_CUSTODIAN_TEAM_ADMIN] };
            expect(getIsTeamAdmin(mockTeam)).toBeTruthy();
        });
        it('should return false if not team admin', () => {
            const mockTeam = { roles: [ROLE_CUSTODIAN_DAR_MANAGER] };
            expect(getIsTeamAdmin(mockTeam)).toBeFalsy();
        });
    });
    describe('getIsTeamAdminOrManager', () => {
        it('should return true if team admin / manager', () => {
            const mockTeam = { roles: [ROLE_CUSTODIAN_TEAM_ADMIN] };
            expect(getIsTeamAdminOrManager(mockTeam)).toBeTruthy();
        });
        it('should return true if team dar manager', () => {
            const mockTeam = { roles: [ROLE_CUSTODIAN_DAR_MANAGER] };
            expect(getIsTeamAdminOrManager(mockTeam)).toBeTruthy();
        });
        it('should return true if team metadata manager', () => {
            const mockTeam = { roles: [ROLE_CUSTODIAN_METADATA_MANAGER] };
            expect(getIsTeamAdminOrManager(mockTeam)).toBeTruthy();
        });
        it('should return false if not team admin / manager', () => {
            const mockTeam = { roles: [PERMISSIONS_TEAM_ROLES.reviewer] };
            expect(getIsTeamAdminOrManager(mockTeam)).toBeFalsy();
        });
    });
});
