import { testUtils } from '../../../test';
import useAccountTeamSelected from './useAccountTeamSelected';

const mockHistoryPush = jest.fn();

jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useHistory: () => ({
        push: mockHistoryPush,
    }),
}));

describe('useAccountTeamSelected hook', () => {
    it('should set teamType and redirect if values not set', () => {
        const wrapper = testUtils.renderHook(() => useAccountTeamSelected());

        expect(wrapper.result.current).toEqual({
            teamType: 'user',
            teamId: undefined,
        });

        expect(mockHistoryPush).toHaveBeenCalledWith('/account?tab=youraccount&teamType=user');
    });

    it('should return values if values set in localstorage', () => {
        const mockTeamId = '1234';
        const wrapper = testUtils.renderHook(() => useAccountTeamSelected(), {
            route: [`?tab=teamManagement&teamType=team&teamId=${mockTeamId}`],
        });

        expect(wrapper.result.current.teamType).toMatch('team');
        expect(wrapper.result.current.teamId).toMatch(mockTeamId);
    });
});
