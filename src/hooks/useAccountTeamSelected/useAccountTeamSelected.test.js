import { testUtils } from '../../../test';
import useAccountTeamSelected from './useAccountTeamSelected';

const { localStorageUtils } = testUtils;

describe('useAccountTeamSelected hook', () => {
    afterEach(() => {
        localStorageUtils.resetLocalStorage();
    });

    it('should return undefined if values not set', () => {
        const wrapper = testUtils.renderHook(() => useAccountTeamSelected());
        expect(wrapper.result.current).toEqual({
            teamType: undefined,
            teamId: undefined,
        });
    });

    it('should return values if values set in localstorage', () => {
        localStorageUtils.setLocalStorage('teamType', 'team');
        localStorageUtils.setLocalStorage('teamId', '1234');

        const wrapper = testUtils.renderHook(() => useAccountTeamSelected());

        expect(wrapper.result.current.teamType).toMatch('team');
        expect(wrapper.result.current.teamId).toMatch('1234');
    });
});
