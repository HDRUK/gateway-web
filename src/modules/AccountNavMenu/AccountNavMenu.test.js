import { useAccountTeamSelected } from 'hooks';
import AccountNavMenu from './AccountNavMenu';
import '@testing-library/jest-dom/extend-expect';
import { testUtils, mocks } from '../../../test';
import { useAuth } from '../../context/AuthContext';

jest.mock('hooks');
jest.mock('../../context/AuthContext');

describe('AccountNavMenu', () => {
    afterEach(() => {
        testUtils.cleanup();
    });

    const props = {
        tabId: 'youraccount',
        setActiveAccordion: jest.fn(),
        activeAccordion: 0,
        allowAccessRequestManagement: true,
        publisherDetails: {
            dataUse: { widget: { enabled: true } },
            questionBank: { enabled: true },
        },
        allowWorkflow: true,
    };

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
                managerInTeam: jest.fn(),
                userState: mocks.userState.mockUserStateAdmin,
            });
            const wrapper = testUtils.render(<AccountNavMenu {...props} />);

            expect(wrapper.container).toMatchSnapshot();
        });
        it('manager', () => {
            useAuth.mockReturnValue({
                isTeamManager: true,
                managerInTeam: jest.fn(),
                userState: mocks.userState.mockUserStateManager,
            });
            const wrapper = testUtils.render(<AccountNavMenu {...props} />);

            expect(wrapper.container).toMatchSnapshot();
        });
        it('reviewer', () => {
            useAuth.mockReturnValue({
                isTeamManager: false,
                managerInTeam: jest.fn(),
                userState: mocks.userState.mockUserStateReviewer,
            });
            const wrapper = testUtils.render(<AccountNavMenu {...props} />);

            expect(wrapper.container).toMatchSnapshot();
        });
        it('metadata editor', () => {
            useAuth.mockReturnValue({
                isTeamManager: false,
                managerInTeam: jest.fn(),
                userState: mocks.userState.mockUserStateMetadataEditor,
            });
            const wrapper = testUtils.render(<AccountNavMenu {...props} />);

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
                managerInTeam: jest.fn(),
                userState: mocks.userState.mockUserStateAdmin,
            });
            const wrapper = testUtils.render(<AccountNavMenu {...props} />);

            expect(wrapper.container).toMatchSnapshot();
        });
        it('manager', () => {
            useAuth.mockReturnValue({
                isTeamManager: true,
                managerInTeam: jest.fn(),
                userState: mocks.userState.mockUserStateManager,
            });
            const wrapper = testUtils.render(<AccountNavMenu {...props} />);

            expect(wrapper.container).toMatchSnapshot();
        });
        it('reviewer', () => {
            useAuth.mockReturnValue({
                isTeamManager: false,
                managerInTeam: jest.fn(),
                userState: mocks.userState.mockUserStateReviewer,
            });
            const wrapper = testUtils.render(<AccountNavMenu {...props} />);

            expect(wrapper.container).toMatchSnapshot();
        });
        it('metadata editor', () => {
            useAuth.mockReturnValue({
                isTeamManager: false,
                managerInTeam: jest.fn(),
                userState: mocks.userState.mockUserStateMetadataEditor,
            });
            const wrapper = testUtils.render(<AccountNavMenu {...props} />);

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
                managerInTeam: jest.fn(),
                userState: mocks.userState.mockUserStateAdmin,
            });
            const wrapper = testUtils.render(<AccountNavMenu {...props} />);

            expect(wrapper.container).toMatchSnapshot();
        });
        it('manager', () => {
            useAuth.mockReturnValue({
                isTeamManager: true,
                managerInTeam: jest.fn(),
                userState: mocks.userState.mockUserStateManager,
            });
            const wrapper = testUtils.render(<AccountNavMenu {...props} />);

            expect(wrapper.container).toMatchSnapshot();
        });
        it('reviewer', () => {
            useAuth.mockReturnValue({
                isTeamManager: false,
                managerInTeam: jest.fn(),
                userState: mocks.userState.mockUserStateReviewer,
            });
            const wrapper = testUtils.render(<AccountNavMenu {...props} />);

            expect(wrapper.container).toMatchSnapshot();
        });
        it('metadata editor', () => {
            useAuth.mockReturnValue({
                isTeamManager: false,
                managerInTeam: jest.fn(),
                userState: mocks.userState.mockUserStateMetadataEditor,
            });
            const wrapper = testUtils.render(<AccountNavMenu {...props} />);

            expect(wrapper.container).toMatchSnapshot();
        });
    });
});
