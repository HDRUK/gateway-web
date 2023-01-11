import { mocks, testUtils } from '../../../test';
import { server } from '../../services/mockServer';
import AccountTeamMembers from './AccountTeamMembers';
import * as Auth from '../../context/AuthContext';
import '@testing-library/jest-dom/extend-expect';

const authSpy = jest.spyOn(Auth, 'useAuth');

const props = {
    teamId: '1234',
};

let wrapper;
let headers;

describe('Given the AccountTeamMembers component', () => {
    beforeAll(() => {
        server.listen();
    });

    afterEach(() => {
        server.resetHandlers();
    });

    afterAll(() => {
        server.close();
    });

    describe('When it is rendered', () => {
        beforeEach(async () => {
            authSpy.mockReturnValue({
                userState: mocks.userState.mockUserStateNonManager,
            });

            wrapper = testUtils.render(<AccountTeamMembers {...props} />);
        });

        afterEach(() => {
            testUtils.cleanup();
        });

        it('Then matches the previous snapshot', async () => {
            expect(wrapper.container).toMatchSnapshot();
        });

        it('Then shows a loader', async () => {
            expect(testUtils.screen.getByText('Loading...')).toMatchSnapshot();
        });

        it('Then matches the previous snapshot', async () => {
            await testUtils.waitFor(() => expect(wrapper.container.querySelector('table')).toBeTruthy());

            expect(wrapper.container).toMatchSnapshot();
        });

        it('Then has the correct headings', async () => {
            await testUtils.waitFor(() => expect(wrapper.container.querySelector('table')).toBeTruthy());

            headers = testUtils.screen.getAllByRole('rowgroup');
            const row = testUtils.within(headers[0]).getByRole('row');
            const cells = testUtils.within(row).getAllByRole('columnheader');

            expect(cells[0].textContent).toEqual('Name');
            expect(cells[1].textContent).toEqual('Team Admin');
            expect(cells[2].textContent).toEqual('Data Access Request');
            expect(cells[3].textContent).toEqual('Metadata');
        });

        it('Then has the correct first row', async () => {
            await testUtils.waitFor(() => expect(wrapper.container.querySelector('table')).toBeTruthy());

            headers = testUtils.screen.getAllByRole('rowgroup');
            const rows = testUtils.within(headers[1]).getAllByRole('row');
            const cells = testUtils.within(rows[0]).getAllByRole('cell');

            expect(testUtils.within(cells[0]).getByRole('link').textContent).toEqual('John Smith');
            expect(testUtils.within(cells[0]).getByText('HDR UK')).toBeTruthy();
        });

        it('Then has the correct second row', async () => {
            await testUtils.waitFor(() => expect(wrapper.container.querySelector('table')).toBeTruthy());

            headers = testUtils.screen.getAllByRole('rowgroup');
            const rows = testUtils.within(headers[1]).getAllByRole('row');
            const cells = testUtils.within(rows[1]).getAllByRole('cell');

            expect(testUtils.within(cells[0]).getByRole('link').textContent).toEqual('Jane Doe');
            expect(testUtils.within(cells[0]).getByText('Google')).toBeTruthy();
        });
    });

    describe('And new member is clicked', () => {
        beforeEach(async () => {
            authSpy.mockReturnValue({
                userState: mocks.userState.mockUserStateManager,
            });

            testUtils.render(<AccountTeamMembers {...props} />);

            await testUtils.waitFor(() => {
                testUtils.screen.getByText(/Add a new member/);
            });

            const addMembersButton = testUtils.screen.getByText(/Add a new member/);

            testUtils.fireEvent.click(addMembersButton);
        });

        afterEach(() => {
            testUtils.cleanup();
        });

        it('Then modal is displayed', () => {
            expect(testUtils.screen.getByText('Add members to your team')).toBeInTheDocument();
        });
    });

    describe('And new member is clicked', () => {
        beforeEach(async () => {
            authSpy.mockReturnValue({
                userState: mocks.userState.mockUserStateManager,
            });

            testUtils.render(<AccountTeamMembers {...props} />);

            await testUtils.waitFor(() => {
                testUtils.screen.getByText(/Add a new member/);
            });

            const addMembersButton = testUtils.screen.getByText(/Add a new member/);

            testUtils.fireEvent.click(addMembersButton);
        });

        afterEach(() => {
            testUtils.cleanup();
        });

        describe('And add member is clicked', () => {
            it('Then has a new row', async () => {
                await testUtils.waitFor(() => {
                    testUtils.screen.getByText('Add members');
                });

                const addMemberButton = testUtils.screen.getByText('Add members');

                testUtils.fireEvent.click(addMemberButton);

                const rows = testUtils.within(headers[1]).getAllByRole('row');
                const cells = testUtils.within(rows[0]).getAllByRole('cell');

                expect(testUtils.within(cells[0]).getByRole('link').textContent).toEqual('John Smith');
                expect(testUtils.within(cells[0]).getByText('HDR UK')).toBeTruthy();
            });
        });

        describe('And Team Admin is enabled', () => {
            let teamAdminCheckbox;

            beforeAll(() => {
                const rows = testUtils.within(headers[1]).getAllByRole('row');
                const cells = testUtils.within(rows[0]).getAllByRole('cell');

                teamAdminCheckbox = testUtils.within(cells[1]).getByLabelText('Admin');

                testUtils.fireEvent.click(teamAdminCheckbox);
            });

            it('Then checks the checkbox', () => {
                expect(teamAdminCheckbox.checked).toBeTruthy();
            });
        });

        describe('And Data access request roles are enabled', () => {
            let cell;

            beforeAll(() => {
                const rows = testUtils.within(headers[1]).getAllByRole('row');
                const cells = testUtils.within(rows[0]).getAllByRole('cell');

                cell = testUtils.within(cells[2]);
            });

            it('Then checks the manager checkbox', () => {
                const checkbox = cell.getByLabelText('Manager');

                testUtils.fireEvent.click(checkbox);

                expect(checkbox.checked).toBeTruthy();
            });

            it('Then checks the reviewer checkbox', () => {
                const checkbox = cell.getByLabelText('Reviewer');

                testUtils.fireEvent.click(checkbox);

                expect(checkbox.checked).toBeTruthy();
            });
        });

        describe('And Metadata roles are enabled', () => {
            let cell;

            beforeAll(() => {
                const rows = testUtils.within(headers[1]).getAllByRole('row');
                const cells = testUtils.within(rows[0]).getAllByRole('cell');

                cell = testUtils.within(cells[3]);
            });

            it('Then checks the manager checkbox', () => {
                const checkbox = cell.getByLabelText('Manager');

                testUtils.fireEvent.click(checkbox);

                expect(checkbox).toBeTruthy();
            });

            it('Then checks the editor checkbox', () => {
                const checkbox = cell.getByLabelText('Editor');

                testUtils.fireEvent.click(checkbox);

                expect(checkbox.checked).toBeTruthy();
            });
        });
    });
});
