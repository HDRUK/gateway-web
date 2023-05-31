import { mocks, testUtils } from '../../../test';
import useCustodianRoles from './useCustodianRoles';
import { useAuth } from '../../context/AuthContext';

jest.mock('../../context/AuthContext');

describe('useCustodianRoles hook', () => {
    it('should return default values if teamId does not exist', () => {
        useAuth.mockReturnValue({
            userState: mocks.userState.mockCustodianMetadataManager,
        });
        const wrapper = testUtils.renderHook(() => useCustodianRoles());
        expect(wrapper.result.current).toEqual({
            isCustodianDarManager: false,
            isCustodianMetadataManager: false,
            isCustodianTeamAdmin: false,
            isMetadataEditor: false,
            isReviewer: false,
        });
    });

    it('should return true for metadata manager', () => {
        useAuth.mockReturnValue({
            userState: mocks.userState.mockCustodianMetadataManager,
        });
        const wrapper = testUtils.renderHook(() => useCustodianRoles('1234'));

        expect(wrapper.result.current).toEqual({
            isCustodianDarManager: false,
            isCustodianMetadataManager: true,
            isCustodianTeamAdmin: false,
            isMetadataEditor: false,
            isReviewer: false,
        });
    });

    it('should return true for metadata editor', () => {
        useAuth.mockReturnValue({
            userState: mocks.userState.mockUserStateMetadataEditor,
        });
        const wrapper = testUtils.renderHook(() => useCustodianRoles('9101'));

        expect(wrapper.result.current).toEqual({
            isCustodianDarManager: false,
            isCustodianMetadataManager: false,
            isCustodianTeamAdmin: false,
            isMetadataEditor: true,
            isReviewer: false,
        });
    });

    it('should return true for team admin', () => {
        useAuth.mockReturnValue({
            userState: mocks.userState.mockCustodianTeamAdmin,
        });
        const wrapper = testUtils.renderHook(() => useCustodianRoles('1234'));

        expect(wrapper.result.current).toEqual({
            isCustodianDarManager: false,
            isCustodianMetadataManager: false,
            isCustodianTeamAdmin: true,
            isMetadataEditor: false,
            isReviewer: false,
        });
    });

    it('should return true for dar reviewer', () => {
        useAuth.mockReturnValue({
            userState: mocks.userState.mockUserStateReviewer,
        });
        const wrapper = testUtils.renderHook(() => useCustodianRoles('5678'));

        expect(wrapper.result.current).toEqual({
            isCustodianDarManager: false,
            isCustodianMetadataManager: false,
            isCustodianTeamAdmin: false,
            isMetadataEditor: false,
            isReviewer: true,
        });
    });

    it('should return true for dar manager', () => {
        useAuth.mockReturnValue({
            userState: mocks.userState.mockCustodianDarManager,
        });
        const wrapper = testUtils.renderHook(() => useCustodianRoles('1234'));

        expect(wrapper.result.current).toEqual({
            isCustodianDarManager: true,
            isCustodianMetadataManager: false,
            isCustodianTeamAdmin: false,
            isMetadataEditor: false,
            isReviewer: false,
        });
    });
});
