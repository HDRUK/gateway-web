import { testUtils } from '../../../test';

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
            wrapper = testUtils.render(<Table {...props} />);

            headers = testUtils.screen.getAllByRole('rowgroup');
        });

        it('Then matches the previous snapshot', async () => {
            expect(wrapper.container).toMatchSnapshot();
        });

        it('Then has the correct className', () => {
            const table = testUtils.screen.getByRole('table');
            expect(table.classList.contains('additional-classname')).toBeTruthy();
        });

        it('Then has the correct headers', () => {
            const row = testUtils.within(headers[0]).getByRole('row');
            const cells = testUtils.within(row).getAllByRole('columnheader');

            expect(cells[0].textContent).toEqual('Name');
            expect(cells[1].textContent).toEqual('Role');
        });

        it('Then has the correct rows', () => {
            props.data.forEach(({ name, role }, i) => {
                const row = testUtils.within(headers[1]).getAllByRole('row')[i];
                const cells = testUtils.within(row).getAllByRole('cell');

                expect(cells[0].textContent).toEqual(name);
                expect(cells[1].textContent).toEqual(role);
            });
        });
    });
});
