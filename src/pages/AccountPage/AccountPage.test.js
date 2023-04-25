import useAccountTeamSelected from 'hooks/useAccountTeamSelected';
import useQueryParam from 'hooks/useQueryParam';
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

jest.mock('hooks/useAccountTeamSelected');
jest.mock('hooks/useQueryParam');

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
                teamId: '1234',
                teamType: 'team',
            });
            useQueryParam.mockReturnValue({
                subNav: 'members',
            });
        });

        it('team admin', () => {
            useAuth.mockReturnValue({
                userState: mocks.userState.mockCustodianTeamAdmin,
            });

            testUtils.render(<AccountPage />);

            expect(testUtils.within(testUtils.screen.getByTestId('accountNavMenu')).getByText('Team Management')).toBeInTheDocument();
            expect(testUtils.within(testUtils.screen.getByTestId('accountNavMenu')).getByText('Help')).toBeInTheDocument();
        });
        it('custodian DAR manager', () => {
            useAuth.mockReturnValue({
                userState: mocks.userState.mockCustodianDarManager,
            });
            testUtils.render(<AccountPage />);

            expect(testUtils.within(testUtils.screen.getByTestId('accountNavMenu')).getByText('Team Management')).toBeInTheDocument();
            expect(testUtils.within(testUtils.screen.getByTestId('accountNavMenu')).getByText('Data access requests')).toBeInTheDocument();
            expect(testUtils.within(testUtils.screen.getByTestId('accountNavMenu')).getByText('Help')).toBeInTheDocument();
        });
        it('custodian metadata manager', () => {
            useAuth.mockReturnValue({
                userState: mocks.userState.mockCustodianMetadataManager,
            });
            testUtils.render(<AccountPage />);

            expect(testUtils.within(testUtils.screen.getByTestId('accountNavMenu')).getByText('Team Management')).toBeInTheDocument();
            expect(testUtils.within(testUtils.screen.getByTestId('accountNavMenu')).getByText('Datasets')).toBeInTheDocument();
            expect(testUtils.within(testUtils.screen.getByTestId('accountNavMenu')).getByText('Help')).toBeInTheDocument();
        });
        it('custodian DAR reviewer', () => {
            useAccountTeamSelected.mockReturnValue({
                teamId: '5678',
                teamType: 'team',
            });
            useAuth.mockReturnValue({
                userState: mocks.userState.mockUserStateReviewer,
            });
            testUtils.render(<AccountPage />);

            expect(testUtils.within(testUtils.screen.getByTestId('accountNavMenu')).getByText('Team Management')).toBeInTheDocument();
            expect(testUtils.within(testUtils.screen.getByTestId('accountNavMenu')).getByText('Data access requests')).toBeInTheDocument();
            expect(testUtils.within(testUtils.screen.getByTestId('accountNavMenu')).getByText('Help')).toBeInTheDocument();
        });
        it('custodian metadata editor', () => {
            useAccountTeamSelected.mockReturnValue({
                teamId: '9101',
                teamType: 'team',
            });
            useAuth.mockReturnValue({
                userState: mocks.userState.mockUserStateMetadataEditor,
            });
            testUtils.render(<AccountPage />);

            expect(testUtils.within(testUtils.screen.getByTestId('accountNavMenu')).getByText('Team Management')).toBeInTheDocument();
            expect(testUtils.within(testUtils.screen.getByTestId('accountNavMenu')).getByText('Datasets')).toBeInTheDocument();
            expect(testUtils.within(testUtils.screen.getByTestId('accountNavMenu')).getByText('Help')).toBeInTheDocument();
        });
    });
    describe('Should render user section', () => {
        beforeAll(() => {
            useAccountTeamSelected.mockReturnValue({
                teamId: null,
                teamType: 'user',
            });
        });

        it('as root admin', () => {
            useAuth.mockReturnValue({
                userState: mocks.userState.mockCustodianMetadataManager,
                isRootAdmin: true,
            });
            const wrapper = testUtils.render(<AccountPage />);

            expect(wrapper.container).toMatchSnapshot();
        });
        it('as non root admin', () => {
            useAuth.mockReturnValue({
                userState: mocks.userState.mockCustodianMetadataManager,
                isRootAdmin: false,
            });
            const wrapper = testUtils.render(<AccountPage />);

            expect(wrapper.container).toMatchSnapshot();
        });
    });
    it('Should render admin section', () => {
        useAuth.mockReturnValue({
            isHDRAdmin: true,
            userState: mocks.userState.mockCustodianTeamAdmin,
        });
        const wrapper = testUtils.render(<AccountPage />);

        expect(wrapper.container).toMatchSnapshot();
    });
});
