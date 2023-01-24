import { mocks, testUtils } from '../../../test';
import CustodianNav from './CustodianNav';
import * as Auth from '../../context/AuthContext';
import '@testing-library/jest-dom/extend-expect';

const authSpy = jest.spyOn(Auth, 'useAuth');

const props = {
    team: { _id: '1234', name: 'Team name' },
};

describe('CustodianNav module', () => {
    afterEach(() => {
        testUtils.cleanup();
    });

    it('should render for desktop', () => {
        const wrapper = testUtils.render(<CustodianNav isMobile={false} {...props} />);
        expect(wrapper.container).toMatchSnapshot();
    });
    it('should render for mobile', () => {
        const wrapper = testUtils.render(<CustodianNav isMobile {...props} />);
        expect(wrapper.container).toMatchSnapshot();
    });

    describe('as a Custodian Team Admin', () => {
        beforeEach(async () => {
            authSpy.mockReturnValue({
                userState: mocks.userState.mockCustodianTeamAdmin,
            });

            testUtils.render(<CustodianNav isMobile={false} {...props} />);

            const toggleButton = testUtils.screen.getByText('Team name');

            testUtils.fireEvent.click(toggleButton);
        });

        it('should render correct nav items', () => {
            expect(testUtils.screen.getByText('Team Management')).toBeInTheDocument();
            expect(testUtils.screen.queryByText('Data access requests')).not.toBeInTheDocument();
            expect(testUtils.screen.queryByText('Edit DAR Form')).not.toBeInTheDocument();
            expect(testUtils.screen.queryByText('Data Uses')).not.toBeInTheDocument();
            expect(testUtils.screen.queryByText('Datasets')).not.toBeInTheDocument();
            expect(testUtils.screen.getByText('Help')).toBeInTheDocument();
        });
    });
    describe('as a Dar Reviewer', () => {
        beforeEach(async () => {
            authSpy.mockReturnValue({
                userState: mocks.userState.mockUserStateReviewer,
            });

            testUtils.render(<CustodianNav isMobile={false} team={{ name: 'Team name', _id: '5678' }} />);

            const toggleButton = testUtils.screen.getByText('Team name');

            testUtils.fireEvent.click(toggleButton);
        });

        it('should render correct nav items', () => {
            expect(testUtils.screen.getByText('Team Management')).toBeInTheDocument();
            expect(testUtils.screen.getByText('Data access requests')).toBeInTheDocument();
            expect(testUtils.screen.queryByText('Edit DAR Form')).not.toBeInTheDocument();
            expect(testUtils.screen.queryByText('Data Uses')).not.toBeInTheDocument();
            expect(testUtils.screen.queryByText('Datasets')).not.toBeInTheDocument();
            expect(testUtils.screen.getByText('Help')).toBeInTheDocument();
        });
    });
    describe('as a Custodian Dar Manager', () => {
        beforeEach(async () => {
            authSpy.mockReturnValue({
                userState: mocks.userState.mockCustodianDarManager,
            });

            testUtils.render(<CustodianNav isMobile={false} {...props} />);

            const toggleButton = testUtils.screen.getByText('Team name');

            testUtils.fireEvent.click(toggleButton);
        });

        it('should render correct nav items', () => {
            expect(testUtils.screen.getByText('Team Management')).toBeInTheDocument();
            expect(testUtils.screen.getByText('Data access requests')).toBeInTheDocument();
            expect(testUtils.screen.getByText('Edit DAR Form')).toBeInTheDocument();
            expect(testUtils.screen.getByText('Data Uses')).toBeInTheDocument();
            expect(testUtils.screen.queryByText('Datasets')).not.toBeInTheDocument();
            expect(testUtils.screen.getByText('Help')).toBeInTheDocument();
        });
    });
    describe('as a Custodian MetaData Manager', () => {
        beforeEach(async () => {
            authSpy.mockReturnValue({
                userState: mocks.userState.mockCustodianMetadataManager,
            });

            testUtils.render(<CustodianNav isMobile={false} {...props} />);

            const toggleButton = testUtils.screen.getByText('Team name');

            testUtils.fireEvent.click(toggleButton);
        });

        it('should render correct nav items', () => {
            expect(testUtils.screen.getByText('Team Management')).toBeInTheDocument();
            expect(testUtils.screen.queryByText('Data access requests')).not.toBeInTheDocument();
            expect(testUtils.screen.queryByText('Edit DAR Form')).not.toBeInTheDocument();
            expect(testUtils.screen.queryByText('Data Uses')).not.toBeInTheDocument();
            expect(testUtils.screen.getByText('Datasets')).toBeInTheDocument();
            expect(testUtils.screen.getByText('Help')).toBeInTheDocument();
        });
    });
    describe('as a Custodian MetaData Editor', () => {
        beforeEach(async () => {
            authSpy.mockReturnValue({
                userState: mocks.userState.mockUserStateMetadataEditor,
            });

            testUtils.render(<CustodianNav isMobile={false} team={{ name: 'Team name', _id: '9101' }} />);

            const toggleButton = testUtils.screen.getByText('Team name');

            testUtils.fireEvent.click(toggleButton);
        });

        it('should render correct nav items', () => {
            expect(testUtils.screen.getByText('Team Management')).toBeInTheDocument();
            expect(testUtils.screen.queryByText('Data access requests')).not.toBeInTheDocument();
            expect(testUtils.screen.queryByText('Edit DAR Form')).not.toBeInTheDocument();
            expect(testUtils.screen.queryByText('Data Uses')).not.toBeInTheDocument();
            expect(testUtils.screen.getByText('Datasets')).toBeInTheDocument();
            expect(testUtils.screen.getByText('Help')).toBeInTheDocument();
        });
    });
});
