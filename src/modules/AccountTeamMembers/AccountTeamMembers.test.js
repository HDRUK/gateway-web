import React from 'react';
import { render, fireEvent, screen, waitFor, within } from 'testUtils';
import { useAuth } from '../../context/AuthContext';
import { server } from '../../services/mockServer';
import AccountTeamMembers from './AccountTeamMembers';

const props = {
    teamId: '5f7b1a2bce9f65e6ed83e7da',
};

jest.mock('../../context/AuthContext', () => ({
    ...jest.requireActual('../../context/AuthContext'),
    useAuth: jest.fn().mockReturnValue({
        isTeamManager: false,
        managerInTeam: jest.fn(),
    }),
}));

// This is temporary until AccountTeamMembersModal has been refactored
jest.mock('../AccountTeamMembersModal', () => ({ onMemberAdded, close, open }) => {
    return open ? (
        <>
            <button
                onClick={() =>
                    onMemberAdded([
                        {
                            firstname: 'Patient',
                            lastname: '0',
                            id: 9101112,
                            roles: ['manager'],
                            organisation: 'HDR',
                            bio: 'Manager',
                        },
                    ])
                }
                type='button'>
                Add member
            </button>
            <button onClick={close} type='button'>
                Close
            </button>
        </>
    ) : (
        <div>Modal closed</div>
    );
});

let wrapper;
let headers;

describe('Given the AccountTeamMembers component', () => {
    describe('When it is rendered', () => {
        beforeAll(() => {
            server.listen();

            wrapper = render(<AccountTeamMembers {...props} />);
        });

        afterEach(() => {
            server.resetHandlers();
        });

        afterAll(() => {
            server.close();
        });

        it('Then matches the previous snapshot', async () => {
            expect(wrapper.container).toMatchSnapshot();
        });

        it('Then shows a loader', async () => {
            expect(screen.getByText('Loading...')).toMatchSnapshot();
        });

        describe('When it is rendered', () => {
            beforeAll(async () => {
                await waitFor(() => expect(wrapper.container.querySelector('table')).toBeTruthy());

                headers = screen.getAllByRole('rowgroup');
            });

            it('Then matches the previous snapshot', async () => {
                expect(wrapper.container).toMatchSnapshot();
            });

            it('Then has the correct headings', async () => {
                const row = within(headers[0]).getByRole('row');
                const cells = within(row).getAllByRole('columnheader');

                expect(cells[0].textContent).toEqual('Name');
                expect(cells[1].textContent).toEqual('Team Admin');
                expect(cells[2].textContent).toEqual('Data Access Request');
                expect(cells[3].textContent).toEqual('Metadata');
            });

            it('Then has the correct first row', () => {
                const rows = within(headers[1]).getAllByRole('row');
                const cells = within(rows[0]).getAllByRole('cell');

                expect(within(cells[0]).getByRole('link').textContent).toEqual('John Smith');
                expect(within(cells[0]).getByText('HDR UK')).toBeTruthy();
            });

            it('Then has the correct second row', () => {
                const rows = within(headers[1]).getAllByRole('row');
                const cells = within(rows[1]).getAllByRole('cell');

                expect(within(cells[0]).getByRole('link').textContent).toEqual('Jane Doe');
                expect(within(cells[0]).getByText('Google')).toBeTruthy();
            });

            describe('And new member is clicked', () => {
                beforeAll(() => {
                    useAuth.mockReturnValue({ isTeamManager: true, managerInTeam: jest.fn() });

                    wrapper.rerender(<AccountTeamMembers {...props} />);

                    const addMembersButton = screen.getByText(/Add a new member/);

                    fireEvent.click(addMembersButton);
                });

                describe('And add member is clicked', () => {
                    beforeAll(() => {
                        const addMemberButton = screen.getByText(/Add member/);

                        fireEvent.click(addMemberButton);
                    });

                    it('Then has a new row', () => {
                        const rows = within(headers[1]).getAllByRole('row');
                        const cells = within(rows[0]).getAllByRole('cell');

                        expect(within(cells[0]).getByRole('link').textContent).toEqual('Patient 0');
                        expect(within(cells[0]).getByText('HDR')).toBeTruthy();
                    });
                });

                describe('And close is clicked', () => {
                    beforeAll(() => {
                        const closeButton = screen.getByText(/Close/);

                        fireEvent.click(closeButton);
                    });

                    it('Then closes the modal', () => {
                        expect(screen.getByText('Modal closed')).toBeTruthy();
                    });
                });
            });

            describe('And new member is clicked', () => {
                beforeAll(() => {
                    useAuth.mockReturnValue({ isTeamManager: true, managerInTeam: jest.fn() });

                    wrapper.rerender(<AccountTeamMembers {...props} />);

                    const addMembersButton = screen.getByText(/Add a new member/);

                    fireEvent.click(addMembersButton);
                });

                describe('And add member is clicked', () => {
                    beforeAll(() => {
                        const addMemberButton = screen.getByText(/Add member/);

                        fireEvent.click(addMemberButton);
                    });

                    it('Then has a new row', () => {
                        const rows = within(headers[1]).getAllByRole('row');
                        const cells = within(rows[0]).getAllByRole('cell');

                        expect(within(cells[0]).getByRole('link').textContent).toEqual('Patient 0');
                        expect(within(cells[0]).getByText('HDR')).toBeTruthy();
                    });
                });

                describe('And Team Admin is enabled', () => {
                    let teamAdminCheckbox;

                    beforeAll(() => {
                        const rows = within(headers[1]).getAllByRole('row');
                        const cells = within(rows[0]).getAllByRole('cell');

                        teamAdminCheckbox = within(cells[1]).getByLabelText('Admin');

                        fireEvent.click(teamAdminCheckbox);
                    });

                    it('Then checks the checkbox', () => {
                        expect(teamAdminCheckbox.checked).toBeTruthy();
                    });
                });

                describe('And Data access request roles are enabled', () => {
                    let cell;

                    beforeAll(() => {
                        const rows = within(headers[1]).getAllByRole('row');
                        const cells = within(rows[0]).getAllByRole('cell');

                        cell = within(cells[2]);
                    });

                    it('Then checks the manager checkbox', () => {
                        const checkbox = cell.getByLabelText('Manager');

                        fireEvent.click(checkbox);

                        expect(checkbox.checked).toBeTruthy();
                    });

                    it('Then checks the reviewer checkbox', () => {
                        const checkbox = cell.getByLabelText('Reviewer');

                        fireEvent.click(checkbox);

                        expect(checkbox.checked).toBeTruthy();
                    });
                });

                describe('And Metadata roles are enabled', () => {
                    let cell;

                    beforeAll(() => {
                        const rows = within(headers[1]).getAllByRole('row');
                        const cells = within(rows[0]).getAllByRole('cell');

                        cell = within(cells[3]);
                    });

                    it('Then checks the manager checkbox', () => {
                        const checkbox = cell.getByLabelText('Manager');

                        fireEvent.click(checkbox);

                        expect(checkbox).toBeTruthy();
                    });

                    it('Then checks the editor checkbox', () => {
                        const checkbox = cell.getByLabelText('Editor');

                        fireEvent.click(checkbox);

                        expect(checkbox.checked).toBeTruthy();
                    });
                });
            });
        });
    });
});
