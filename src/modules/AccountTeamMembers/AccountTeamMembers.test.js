import { mocks, testUtils } from '../../../test';
import { server } from '../../services/mockServer';
import AccountTeamMembers from './AccountTeamMembers';
import * as Auth from '../../context/AuthContext';
import '@testing-library/jest-dom/extend-expect';
import { mockTeamsMembersV3 } from '../../../test/handlers';

const authSpy = jest.spyOn(Auth, 'useAuth');

const props = {
    teamId: '1234',
    handleRemove: jest.fn(),
    teamMembers: mockTeamsMembersV3,
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

            expect(testUtils.within(cells[0]).getByRole('link').textContent).toEqual('Leopoldo Hyatt');
            expect(testUtils.within(cells[0]).getByText('Hermann, Leannon and Kuhlman')).toBeTruthy();
        });

        it('should render the second row', async () => {
            await testUtils.waitFor(() => expect(wrapper.container.querySelector('table')).toBeTruthy());

            headers = testUtils.screen.getAllByRole('rowgroup');
            const rows = testUtils.within(headers[1]).getAllByRole('row');
            const cells = testUtils.within(rows[1]).getAllByRole('cell');

            expect(testUtils.within(cells[0]).getByRole('link').textContent).toEqual('Alberto Kreiger');
            expect(testUtils.within(cells[0]).getByText('Paucek LLC')).toBeTruthy();
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

        it('should toggle checkbox on select', async () => {
            const checkbox = testUtils.within(cells[1]).getByLabelText('Admin');

            expect(checkbox).not.toBeChecked();

            testUtils.fireEvent.click(checkbox);

            await testUtils.waitFor(() => {
                expect(testUtils.within(cells[1]).getByLabelText('Admin')).toBeChecked();
            });
        });

        it('Dar manager checkbox should be disabled as one role', () => {
            const checkbox = testUtils.within(cells[2]).getByLabelText('Manager');

            expect(checkbox).toBeDisabled();
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
        it('Remove member button to be enabled', () => {
            const popover = testUtils.within(cells[4]).getByRole('button');
            popover.click();

            const button = testUtils.within(testUtils.screen.getByTestId('popoverMenu')).getByRole('button');
            expect(button).toBeEnabled();
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
        it('Remove member button to be disabled', () => {
            const popover = testUtils.within(cells[4]).getByRole('button');
            popover.click();

            const button = testUtils.within(testUtils.screen.getByTestId('popoverMenu')).getByRole('button');
            expect(button).toBeDisabled();
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
        it('Dar manager checkbox should be disabled as one role', () => {
            const checkbox = testUtils.within(cells[2]).getByLabelText('Manager');

            expect(checkbox).toBeDisabled();
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
        it('Remove member button to be disabled', () => {
            const popover = testUtils.within(cells[4]).getByRole('button');
            popover.click();

            const button = testUtils.within(testUtils.screen.getByTestId('popoverMenu')).getByRole('button');
            expect(button).toBeDisabled();
        });
    });
    describe('as a metadata editor', () => {
        let cells;
        beforeEach(async () => {
            authSpy.mockReturnValue({
                userState: mocks.userState.mockUserStateMetadataEditor,
            });

            const wrapper = testUtils.render(<AccountTeamMembers {...props} />);

            await testUtils.waitFor(() => expect(wrapper.container.querySelector('table')).toBeTruthy());

            const headers = testUtils.screen.getAllByRole('rowgroup');
            const rows = testUtils.within(headers[1]).getAllByRole('row');
            cells = testUtils.within(rows[0]).getAllByRole('cell');
        });
        it('Remove member button to be disabled', () => {
            const popover = testUtils.within(cells[4]).getByRole('button');
            popover.click();

            const button = testUtils.within(testUtils.screen.getByTestId('popoverMenu')).getByRole('button');
            expect(button).toBeDisabled();
        });
    });
    describe('as a DAR reviewer', () => {
        let cells;
        beforeEach(async () => {
            authSpy.mockReturnValue({
                userState: mocks.userState.mockUserStateReviewer,
            });

            const wrapper = testUtils.render(<AccountTeamMembers {...props} />);

            await testUtils.waitFor(() => expect(wrapper.container.querySelector('table')).toBeTruthy());

            const headers = testUtils.screen.getAllByRole('rowgroup');
            const rows = testUtils.within(headers[1]).getAllByRole('row');
            cells = testUtils.within(rows[0]).getAllByRole('cell');
        });
        it('Remove member button to be disabled', () => {
            const popover = testUtils.within(cells[4]).getByRole('button');
            popover.click();

            const button = testUtils.within(testUtils.screen.getByTestId('popoverMenu')).getByRole('button');
            expect(button).toBeDisabled();
        });
    });
    describe('as a non "team" admin and HDR admin', () => {
        let cells;
        beforeEach(async () => {
            authSpy.mockReturnValue({
                userState: mocks.userState.mockUserStateReviewer,
                isHDRAdmin: true,
            });

            const wrapper = testUtils.render(<AccountTeamMembers {...props} />);

            await testUtils.waitFor(() => expect(wrapper.container.querySelector('table')).toBeTruthy());

            const headers = testUtils.screen.getAllByRole('rowgroup');
            const rows = testUtils.within(headers[1]).getAllByRole('row');
            cells = testUtils.within(rows[0]).getAllByRole('cell');
        });
        it('Remove member button to be enabled', () => {
            const popover = testUtils.within(cells[4]).getByRole('button');
            popover.click();

            const button = testUtils.within(testUtils.screen.getByTestId('popoverMenu')).getByRole('button');
            expect(button).toBeEnabled();
        });
    });
});
