import { resetSelectedTeam, updateSelectedTeam } from './account.util';

describe('account utils', () => {
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

    it('should reset teamType/TeamId', () => {
        resetSelectedTeam();
        expect(localStorage.getItem('teamType')).toBeNull();
    });
});
