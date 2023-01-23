import { PERMISSIONS_TEAM_ROLES, ROLE_CUSTODIAN_DAR_MANAGER, ROLE_CUSTODIAN_METADATA_MANAGER, ROLE_CUSTODIAN_TEAM_ADMIN } from 'consts';
import { getIsCustodianTeamAdmin, getIsCustodianAdminOrManager } from './role.util';

describe('role Util', () => {
    describe('getIsCustodianTeamAdmin', () => {
        it('should return true if team admin', () => {
            const mockRoles = [ROLE_CUSTODIAN_TEAM_ADMIN];
            expect(getIsCustodianTeamAdmin(mockRoles)).toBeTruthy();
        });
        it('should return false if not team admin', () => {
            const mockRoles = [ROLE_CUSTODIAN_DAR_MANAGER];
            expect(getIsCustodianTeamAdmin(mockRoles)).toBeFalsy();
        });
    });
    describe('getIsCustodianAdminOrManager', () => {
        it('should return true if team admin / manager', () => {
            const mockRoles = [ROLE_CUSTODIAN_TEAM_ADMIN];
            expect(getIsCustodianAdminOrManager(mockRoles)).toBeTruthy();
        });
        it('should return true if team dar manager', () => {
            const mockRoles = [ROLE_CUSTODIAN_DAR_MANAGER];
            expect(getIsCustodianAdminOrManager(mockRoles)).toBeTruthy();
        });
        it('should return true if team metadata manager', () => {
            const mockRoles = [ROLE_CUSTODIAN_METADATA_MANAGER];
            expect(getIsCustodianAdminOrManager(mockRoles)).toBeTruthy();
        });
        it('should return false if not team admin / manager', () => {
            const mockRoles = [PERMISSIONS_TEAM_ROLES.reviewer];
            expect(getIsCustodianAdminOrManager(mockRoles)).toBeFalsy();
        });
    });
});
