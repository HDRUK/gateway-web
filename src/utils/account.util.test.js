import { teamMembersMock } from '../../test/mocks/teamsServiceMock';
import { getTeam } from './account.util';

describe('account utils', () => {
    describe('getTeam', () => {
        it('should return team by id', () => {
            expect(getTeam(teamMembersMock, '5678')).toEqual(teamMembersMock[0]);
        });
    });
});
