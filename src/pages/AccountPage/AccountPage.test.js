import { useAccountTeamSelected } from 'hooks';
import AccountPage from './AccountPage';
import '@testing-library/jest-dom/extend-expect';
import { testUtils, mocks } from '../../../test';
import { useAuth } from '../../context/AuthContext';
import { server } from '../../services/mockServer';

jest.mock('react-router-dom', () => {
    return {
        ...jest.requireActual('react-router-dom'),
        useLocation: () => {
            return {
                pathname: '/account',
                search: '?tab=youraccount',
                hash: '',
                state: null,
                key: 'default',
            };
        },
    };
});

jest.mock('hooks');
jest.mock('../../context/AuthContext');

describe('AccountPage', () => {
    beforeAll(() => {
        server.listen();
    });

    afterEach(() => {
        server.resetHandlers();
        testUtils.cleanup();
    });

    afterAll(() => {
        server.close();
    });

    describe('Should render correctly for team section', () => {
        beforeAll(() => {
            useAccountTeamSelected.mockReturnValue({
                teamId: '2134',
                teamType: 'team',
            });
        });

        it('root admin', () => {
            useAuth.mockReturnValue({
                isTeamManager: false,
                isRootAdmin: true,
                managerInTeam: jest.fn(),
                userState: mocks.userState.mockUserStateAdmin,
            });
            const wrapper = testUtils.render(<AccountPage />);

            expect(wrapper.container).toMatchSnapshot();
        });
        it('manager', () => {
            useAuth.mockReturnValue({
                isTeamManager: true,
                managerInTeam: jest.fn(),
                userState: mocks.userState.mockUserStateManager,
            });
            const wrapper = testUtils.render(<AccountPage />);

            expect(wrapper.container).toMatchSnapshot();
        });
        it('reviewer', () => {
            useAuth.mockReturnValue({
                isTeamManager: false,
                managerInTeam: jest.fn(),
                userState: mocks.userState.mockUserStateReviewer,
            });
            const wrapper = testUtils.render(<AccountPage />);

            expect(wrapper.container).toMatchSnapshot();
        });
        it('metadata editor', () => {
            useAuth.mockReturnValue({
                isTeamManager: false,
                managerInTeam: jest.fn(),
                userState: mocks.userState.mockUserStateMetadataEditor,
            });
            const wrapper = testUtils.render(<AccountPage />);

            expect(wrapper.container).toMatchSnapshot();
        });
    });
    describe('Should render correctly for user section', () => {
        beforeAll(() => {
            useAccountTeamSelected.mockReturnValue({
                teamId: null,
                teamType: 'user',
            });
        });

        it('root admin', () => {
            useAuth.mockReturnValue({
                isTeamManager: false,
                isRootAdmin: true,
                managerInTeam: jest.fn(),
                userState: mocks.userState.mockUserStateAdmin,
            });
            const wrapper = testUtils.render(<AccountPage />);

            expect(wrapper.container).toMatchSnapshot();
        });
        it('manager', () => {
            useAuth.mockReturnValue({
                isTeamManager: true,
                managerInTeam: jest.fn(),
                userState: mocks.userState.mockUserStateManager,
            });
            const wrapper = testUtils.render(<AccountPage />);

            expect(wrapper.container).toMatchSnapshot();
        });
        it('reviewer', () => {
            useAuth.mockReturnValue({
                isTeamManager: false,
                managerInTeam: jest.fn(),
                userState: mocks.userState.mockUserStateReviewer,
            });
            const wrapper = testUtils.render(<AccountPage />);

            expect(wrapper.container).toMatchSnapshot();
        });
        it('metadata editor', () => {
            useAuth.mockReturnValue({
                isTeamManager: false,
                managerInTeam: jest.fn(),
                userState: mocks.userState.mockUserStateMetadataEditor,
            });
            const wrapper = testUtils.render(<AccountPage />);

            expect(wrapper.container).toMatchSnapshot();
        });
    });
    describe('Should render correctly for admin section', () => {
        beforeAll(() => {
            useAccountTeamSelected.mockReturnValue({
                teamId: null,
                teamType: 'admin',
            });
        });

        it('root admin', () => {
            useAuth.mockReturnValue({
                isTeamManager: false,
                isRootAdmin: true,
                managerInTeam: jest.fn(),
                userState: mocks.userState.mockUserStateAdmin,
            });
            const wrapper = testUtils.render(<AccountPage />);

            expect(wrapper.container).toMatchSnapshot();
        });
        it('manager', () => {
            useAuth.mockReturnValue({
                isTeamManager: true,
                managerInTeam: jest.fn(),
                userState: mocks.userState.mockUserStateManager,
            });
            const wrapper = testUtils.render(<AccountPage />);

            expect(wrapper.container).toMatchSnapshot();
        });
        it('reviewer', () => {
            useAuth.mockReturnValue({
                isTeamManager: false,
                managerInTeam: jest.fn(),
                userState: mocks.userState.mockUserStateReviewer,
            });
            const wrapper = testUtils.render(<AccountPage />);

            expect(wrapper.container).toMatchSnapshot();
        });
        it('metadata editor', () => {
            useAuth.mockReturnValue({
                isTeamManager: false,
                managerInTeam: jest.fn(),
                userState: mocks.userState.mockUserStateMetadataEditor,
            });
            const wrapper = testUtils.render(<AccountPage />);

            expect(wrapper.container).toMatchSnapshot();
        });
    });
});
