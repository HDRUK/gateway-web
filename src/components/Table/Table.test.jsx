import { render, screen, within } from 'testUtils';
import React from 'react';
import Table from './Table';

const props = {
    className: 'additional-classname',
    columns: [
        {
            Header: 'Name',
            accessor: 'name',
        },
        {
            Header: 'Role',
            accessor: 'role',
        },
    ],
    data: [
        {
            name: 'Kymme Hayley',
            role: 'Admin',
        },
        {
            name: 'Peter Hammans',
            role: 'Admin',
        },
        {
            name: 'Geeta Kotecha',
            role: 'Admin',
        },
    ],
};

let wrapper;
let headers;

describe('Given the Table component', () => {
    describe('When it is rendered', () => {
        beforeAll(() => {
            wrapper = render(<Table {...props} />);

            headers = screen.getAllByRole('rowgroup');
        });

        it('Then matches the previous snapshot', async () => {
            expect(wrapper.container).toMatchSnapshot();
        });

        it('Then has the correct className', () => {
            const table = screen.getByRole('table');
            expect(table.classList.contains('additional-classname')).toBeTruthy();
        });

        it('Then has the correct headers', () => {
            const row = within(headers[0]).getByRole('row');
            const cells = within(row).getAllByRole('columnheader');

            expect(cells[0].textContent).toEqual('Name');
            expect(cells[1].textContent).toEqual('Role');
        });

        it('Then has the correct rows', () => {
            props.data.forEach(({ name, role }, i) => {
                const row = within(headers[1]).getAllByRole('row')[i];
                const cells = within(row).getAllByRole('cell');

                expect(cells[0].textContent).toEqual(name);
                expect(cells[1].textContent).toEqual(role);
            });
        });
    });
});
