import { mocks, testUtils } from '../../../test';
import useRoles from './useRoles';
import { useAuth } from '../../context/AuthContext';

jest.mock('../../context/AuthContext');

describe('useRoles hook', () => {
    it('should return default values if teamId does not exist', () => {
        useAuth.mockReturnValue({
            isTeamManager: false,
            managerInTeam: jest.fn(),
            userState: mocks.userState.mockCustodianMetadataManager,
        });
        const wrapper = testUtils.renderHook(() => useRoles());
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
            isTeamManager: false,
            managerInTeam: jest.fn(),
            userState: mocks.userState.mockCustodianMetadataManager,
        });
        const wrapper = testUtils.renderHook(() => useRoles('1234'));

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
            isTeamManager: false,
            managerInTeam: jest.fn(),
            userState: mocks.userState.mockUserStateMetadataEditor,
        });
        const wrapper = testUtils.renderHook(() => useRoles('9101'));

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
            isTeamManager: false,
            managerInTeam: jest.fn(),
            userState: mocks.userState.mockCustodianTeamAdmin,
        });
        const wrapper = testUtils.renderHook(() => useRoles('1234'));

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
            isTeamManager: false,
            managerInTeam: jest.fn(),
            userState: mocks.userState.mockUserStateReviewer,
        });
        const wrapper = testUtils.renderHook(() => useRoles('5678'));

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
            isTeamManager: false,
            managerInTeam: jest.fn(),
            userState: mocks.userState.mockCustodianDarManager,
        });
        const wrapper = testUtils.renderHook(() => useRoles('1234'));

        expect(wrapper.result.current).toEqual({
            isCustodianDarManager: true,
            isCustodianMetadataManager: false,
            isCustodianTeamAdmin: false,
            isMetadataEditor: false,
            isReviewer: false,
        });
    });
});
