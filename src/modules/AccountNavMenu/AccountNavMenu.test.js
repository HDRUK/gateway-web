import { useAccountTeamSelected } from 'hooks';
import AccountNavMenu from './AccountNavMenu';
import '@testing-library/jest-dom/extend-expect';
import { testUtils, mocks } from '../../../test';
import { useAuth } from '../../context/AuthContext';

jest.mock('hooks/useAccountTeamSelected');
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
                teamId: '1234',
                teamType: 'team',
            });
        });

        it('team admin', () => {
            useAuth.mockReturnValue({
                isRootAdmin: true,
                userState: mocks.userState.mockCustodianTeamAdmin,
            });
            testUtils.render(<AccountNavMenu {...props} />);

            expect(testUtils.within(testUtils.screen.getByTestId('accountNavMenu')).getByText('Team Management')).toBeInTheDocument();
            expect(testUtils.within(testUtils.screen.getByTestId('accountNavMenu')).getByText('Help')).toBeInTheDocument();
        });
        it('custodian DAR manager', () => {
            useAuth.mockReturnValue({
                userState: mocks.userState.mockCustodianDarManager,
            });

            testUtils.render(<AccountNavMenu {...props} />);

            expect(testUtils.within(testUtils.screen.getByTestId('accountNavMenu')).getByText('Team Management')).toBeInTheDocument();
            expect(testUtils.within(testUtils.screen.getByTestId('accountNavMenu')).getByText('Data access requests')).toBeInTheDocument();
            expect(testUtils.within(testUtils.screen.getByTestId('accountNavMenu')).getByText('Edit DAR Form')).toBeInTheDocument();
            expect(testUtils.within(testUtils.screen.getByTestId('accountNavMenu')).getByText('Help')).toBeInTheDocument();
        });
        it('custodian metadata manager', () => {
            useAuth.mockReturnValue({
                userState: mocks.userState.mockCustodianMetadataManager,
            });
            testUtils.render(<AccountNavMenu {...props} />);

            expect(testUtils.within(testUtils.screen.getByTestId('accountNavMenu')).getByText('Team Management')).toBeInTheDocument();
            expect(testUtils.within(testUtils.screen.getByTestId('accountNavMenu')).getByText('Datasets')).toBeInTheDocument();
            expect(testUtils.within(testUtils.screen.getByTestId('accountNavMenu')).getByText('Help')).toBeInTheDocument();
        });
        it('custodian DAR reviewer', () => {
            useAuth.mockReturnValue({
                userState: mocks.userState.mockUserStateReviewer,
            });
            useAccountTeamSelected.mockReturnValue({
                teamId: '5678',
                teamType: 'team',
            });
            testUtils.render(<AccountNavMenu {...props} />);

            expect(testUtils.within(testUtils.screen.getByTestId('accountNavMenu')).getByText('Team Management')).toBeInTheDocument();
            expect(testUtils.within(testUtils.screen.getByTestId('accountNavMenu')).getByText('Data access requests')).toBeInTheDocument();
            expect(testUtils.within(testUtils.screen.getByTestId('accountNavMenu')).getByText('Help')).toBeInTheDocument();
        });
        it('custodian metadata editor', () => {
            useAuth.mockReturnValue({
                userState: mocks.userState.mockUserStateMetadataEditor,
            });
            useAccountTeamSelected.mockReturnValue({
                teamId: '9101',
                teamType: 'team',
            });
            testUtils.render(<AccountNavMenu {...props} />);

            expect(testUtils.within(testUtils.screen.getByTestId('accountNavMenu')).getByText('Team Management')).toBeInTheDocument();
            expect(testUtils.within(testUtils.screen.getByTestId('accountNavMenu')).getByText('Datasets')).toBeInTheDocument();
            expect(testUtils.within(testUtils.screen.getByTestId('accountNavMenu')).getByText('Help')).toBeInTheDocument();
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
                isRootAdmin: true,

                userState: mocks.userState.mockUserStateAdmin,
            });
            const wrapper = testUtils.render(<AccountNavMenu {...props} />);

            expect(wrapper.container).toMatchSnapshot();
        });
    });
    describe('Should render admin section', () => {
        beforeAll(() => {
            useAccountTeamSelected.mockReturnValue({
                teamId: null,
                teamType: 'admin',
            });
        });

        it('as root admin', () => {
            useAuth.mockReturnValue({
                isRootAdmin: true,

                userState: mocks.userState.mockUserStateAdmin,
            });
            const wrapper = testUtils.render(<AccountNavMenu {...props} />);

            expect(wrapper.container).toMatchSnapshot();
        });
        it('as non root admin', () => {
            useAuth.mockReturnValue({
                isRootAdmin: false,

                userState: mocks.userState.mockUserStateAdmin,
            });
            const wrapper = testUtils.render(<AccountNavMenu {...props} />);

            expect(wrapper.container).toMatchSnapshot();
        });
    });
});
