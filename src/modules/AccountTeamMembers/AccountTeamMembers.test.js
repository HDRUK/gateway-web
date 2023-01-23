import { mocks, testUtils } from '../../../test';
import { server } from '../../services/mockServer';
import AccountTeamMembers from './AccountTeamMembers';
import * as Auth from '../../context/AuthContext';
import '@testing-library/jest-dom/extend-expect';

const authSpy = jest.spyOn(Auth, 'useAuth');

const props = {
    teamId: '1234',
};

describe('AccountTeamMembers component', () => {
    beforeAll(() => {
        server.listen();
    });

    afterEach(() => {
        server.resetHandlers();
    });

    afterAll(() => {
        server.close();
    });

    afterEach(() => {
        testUtils.cleanup();
    });

    describe('render', () => {
        let wrapper;
        let headers;
        beforeEach(async () => {
            authSpy.mockReturnValue({
                userState: mocks.userState.mockUserStateNonManager,
            });

            wrapper = testUtils.render(<AccountTeamMembers {...props} />);
        });

        it('should match the previous snapshot', async () => {
            expect(wrapper.container).toMatchSnapshot();
        });

        it('should show a loader', async () => {
            expect(testUtils.screen.getByText('Loading...')).toMatchSnapshot();
        });

        it('should render the table', async () => {
            await testUtils.waitFor(() => expect(wrapper.container.querySelector('table')).toBeTruthy());

            expect(wrapper.container).toMatchSnapshot();
        });

        it('should have the correct headings', async () => {
            await testUtils.waitFor(() => expect(wrapper.container.querySelector('table')).toBeTruthy());

            headers = testUtils.screen.getAllByRole('rowgroup');
            const row = testUtils.within(headers[0]).getByRole('row');
            const cells = testUtils.within(row).getAllByRole('columnheader');

            expect(cells[0].textContent).toEqual('Name');
            expect(cells[1].textContent).toEqual('Team Admin');
            expect(cells[2].textContent).toEqual('Data Access Request');
            expect(cells[3].textContent).toEqual('Metadata');
        });

        it('should render the first row', async () => {
            await testUtils.waitFor(() => expect(wrapper.container.querySelector('table')).toBeTruthy());

            headers = testUtils.screen.getAllByRole('rowgroup');
            const rows = testUtils.within(headers[1]).getAllByRole('row');
            const cells = testUtils.within(rows[0]).getAllByRole('cell');

            expect(testUtils.within(cells[0]).getByRole('link').textContent).toEqual('John Smith');
            expect(testUtils.within(cells[0]).getByText('HDR UK')).toBeTruthy();
        });

        it('should render the second row', async () => {
            await testUtils.waitFor(() => expect(wrapper.container.querySelector('table')).toBeTruthy());

            headers = testUtils.screen.getAllByRole('rowgroup');
            const rows = testUtils.within(headers[1]).getAllByRole('row');
            const cells = testUtils.within(rows[1]).getAllByRole('cell');

            expect(testUtils.within(cells[0]).getByRole('link').textContent).toEqual('Jane Doe');
            expect(testUtils.within(cells[0]).getByText('Google')).toBeTruthy();
        });
    });

    describe('should launch add member modal', () => {
        let wrapper;

        beforeEach(async () => {
            authSpy.mockReturnValue({
                userState: mocks.userState.mockCustodianTeamAdmin,
            });

            wrapper = testUtils.render(<AccountTeamMembers {...props} />);

            await testUtils.waitFor(() => {
                testUtils.screen.getByText(/Add a new member/);
            });

            const addMembersButton = testUtils.screen.getByText(/Add a new member/);

            testUtils.fireEvent.click(addMembersButton);
        });

        afterEach(() => {
            testUtils.cleanup();
        });

        it('should add new member', async () => {
            await testUtils.waitFor(() => {
                testUtils.screen.getByText('Add members');
            });

            const addMemberButton = testUtils.screen.getByText('Add members');

            testUtils.fireEvent.click(addMemberButton);

            await testUtils.waitFor(() => expect(wrapper.container.querySelector('table')).toBeTruthy());
        });
    });

    describe('as a team admin', () => {
        let cells;
        beforeEach(async () => {
            authSpy.mockReturnValue({
                userState: mocks.userState.mockCustodianTeamAdmin,
            });

            const wrapper = testUtils.render(<AccountTeamMembers {...props} />);

            await testUtils.waitFor(() => expect(wrapper.container.querySelector('table')).toBeTruthy());

            const headers = testUtils.screen.getAllByRole('rowgroup');
            const rows = testUtils.within(headers[1]).getAllByRole('row');
            cells = testUtils.within(rows[0]).getAllByRole('cell');
        });

        it('team admin checkbox should be enabled', () => {
            const checkbox = testUtils.within(cells[1]).getByLabelText('Admin');

            expect(checkbox).toBeEnabled();
        });
        it('Dar manager checkbox should be enabled', () => {
            const checkbox = testUtils.within(cells[2]).getByLabelText('Manager');

            expect(checkbox).toBeEnabled();
        });
        it('Dar reviewer checkbox should be enabled', () => {
            const checkbox = testUtils.within(cells[2]).getByLabelText('Reviewer');

            expect(checkbox).toBeEnabled();
        });
        it('Metadata manager checkbox should be enabled', () => {
            const checkbox = testUtils.within(cells[3]).getByLabelText('Manager');

            expect(checkbox).toBeEnabled();
        });
        it('Metadata editor checkbox should be enabled', () => {
            const checkbox = testUtils.within(cells[3]).getByLabelText('Editor');

            expect(checkbox).toBeEnabled();
        });
    });
    describe('as a metadata manager', () => {
        let cells;
        beforeEach(async () => {
            authSpy.mockReturnValue({
                userState: mocks.userState.mockCustodianMetadataManager,
            });

            const wrapper = testUtils.render(<AccountTeamMembers {...props} />);

            await testUtils.waitFor(() => expect(wrapper.container.querySelector('table')).toBeTruthy());

            const headers = testUtils.screen.getAllByRole('rowgroup');
            const rows = testUtils.within(headers[1]).getAllByRole('row');
            cells = testUtils.within(rows[0]).getAllByRole('cell');
        });

        it('team admin checkbox should be disabled', () => {
            const checkbox = testUtils.within(cells[1]).getByLabelText('Admin');

            expect(checkbox).toBeDisabled();
        });
        it('Dar manager checkbox should be disabled', () => {
            const checkbox = testUtils.within(cells[2]).getByLabelText('Manager');

            expect(checkbox).toBeDisabled();
        });
        it('Dar reviewer checkbox should be disabled', () => {
            const checkbox = testUtils.within(cells[2]).getByLabelText('Reviewer');

            expect(checkbox).toBeDisabled();
        });
        it('Metadata manager checkbox should be enabled', () => {
            const checkbox = testUtils.within(cells[3]).getByLabelText('Manager');

            expect(checkbox).toBeEnabled();
        });
        it('Metadata editor checkbox should be enabled', () => {
            const checkbox = testUtils.within(cells[3]).getByLabelText('Editor');

            expect(checkbox).toBeEnabled();
        });
    });
    describe('as a dar manager', () => {
        let cells;
        beforeEach(async () => {
            authSpy.mockReturnValue({
                userState: mocks.userState.mockCustodianDarManager,
            });

            const wrapper = testUtils.render(<AccountTeamMembers {...props} />);

            await testUtils.waitFor(() => expect(wrapper.container.querySelector('table')).toBeTruthy());

            const headers = testUtils.screen.getAllByRole('rowgroup');
            const rows = testUtils.within(headers[1]).getAllByRole('row');
            cells = testUtils.within(rows[0]).getAllByRole('cell');
        });

        it('team admin checkbox should be disabled', () => {
            const checkbox = testUtils.within(cells[1]).getByLabelText('Admin');

            expect(checkbox).toBeDisabled();
        });
        it('Dar manager checkbox should be enabled', () => {
            const checkbox = testUtils.within(cells[2]).getByLabelText('Manager');

            expect(checkbox).toBeEnabled();
        });
        it('Dar reviewer checkbox should be enabled', () => {
            const checkbox = testUtils.within(cells[2]).getByLabelText('Reviewer');

            expect(checkbox).toBeEnabled();
        });
        it('Metadata manager checkbox should be disabled', () => {
            const checkbox = testUtils.within(cells[3]).getByLabelText('Manager');

            expect(checkbox).toBeDisabled();
        });
        it('Metadata editor checkbox should be disabled', () => {
            const checkbox = testUtils.within(cells[3]).getByLabelText('Editor');

            expect(checkbox).toBeDisabled();
        });
    });
});
