import { teamMembersMock } from '../../test/mocks/teamsServiceMock';
import { resetSelectedTeam, updateSelectedTeam, getTeam } from './account.util';

describe('account utils', () => {
    describe('updateSelectedTeam', () => {
        it('should set teamType/teamId', () => {
            updateSelectedTeam({ teamType: 'team', teamId: '1234' });
            expect(localStorage.getItem('teamType')).toEqual('team');
            expect(localStorage.getItem('teamId')).toEqual('1234');
        });

        it('should set teamType', () => {
            updateSelectedTeam({ teamType: 'user' });
            expect(localStorage.getItem('teamType')).toBe('user');
            expect(localStorage.getItem('teamId')).toBeNull();
        });
    });

    describe('resetSelectedTeam', () => {
        it('should reset teamType/TeamId', () => {
            resetSelectedTeam();
            expect(localStorage.getItem('teamType')).toBeNull();
        });
    });
    describe('getTeam', () => {
        it('should return team by id', () => {
            expect(getTeam(teamMembersMock, '5678')).toEqual(teamMembersMock[0]);
        });
    });
});
