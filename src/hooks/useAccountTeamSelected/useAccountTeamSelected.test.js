import { testUtils } from '../../../test';
import useAccountTeamSelected from './useAccountTeamSelected';

const { localStorageUtils } = testUtils;

const mockHistoryPush = jest.fn();

jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useHistory: () => ({
        push: mockHistoryPush,
    }),
}));

describe('useAccountTeamSelected hook', () => {
    afterEach(() => {
        localStorageUtils.resetLocalStorage();
    });

    it('should set teamType and redirect if values not set', () => {
        const wrapper = testUtils.renderHook(() => useAccountTeamSelected());
        expect(wrapper.result.current).toEqual({
            teamType: 'user',
            teamId: undefined,
        });
        expect(mockHistoryPush).toHaveBeenCalledWith('/account?tab=youraccount');
    });

    it('should return values if values set in localstorage', () => {
        localStorageUtils.setLocalStorage('teamType', 'team');
        localStorageUtils.setLocalStorage('teamId', '1234');

        const wrapper = testUtils.renderHook(() => useAccountTeamSelected());

        expect(wrapper.result.current.teamType).toMatch('team');
        expect(wrapper.result.current.teamId).toMatch('1234');
    });
});
