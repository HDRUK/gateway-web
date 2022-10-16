import { render, screen, waitFor, within } from '@testing-library/react';
import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { server } from '../../services/mockServer';
import AccountTeamMembers from './AccountTeamMembers';

const props = {
    teamId: '5f7b1a2bce9f65e6ed83e7da',
};

jest.mock('../../context/AuthContext', () => ({
    ...jest.requireActual('../../context/AuthContext'),
    useAuth: jest.fn().mockReturnValue({
        managerInTeam: jest.fn(),
    }),
}));

// const managerInTeamMock = jest.fn();

let wrapper;
let headers;

describe('Given the AccountTeamMembers component', () => {
    describe('When it is rendered', () => {
        beforeAll(() => {
            server.listen();

            wrapper = render(<AccountTeamMembers {...props} />, {
                wrapper: Providers,
            });
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
                expect(cells[1].textContent).toEqual('Role');
            });

            it('Then has the correct first row', () => {
                const rows = within(headers[1]).getAllByRole('row');
                const cells = within(rows[0]).getAllByRole('cell');

                expect(within(cells[0]).getByRole('link').textContent).toEqual('John Smith');
                expect(within(cells[0]).getByText('HDR UK')).toBeTruthy();
                expect(within(cells[1]).getByText(/Manager/)).toBeTruthy();
            });

            it('Then has the correct second row', () => {
                const rows = within(headers[1]).getAllByRole('row');
                const cells = within(rows[1]).getAllByRole('cell');

                expect(within(cells[0]).getByRole('link').textContent).toEqual('Jane Doe');
                expect(within(cells[0]).getByText('Google')).toBeTruthy();
                expect(within(cells[1]).getByText(/Manager/)).toBeTruthy();
            });
        });
    });
});
