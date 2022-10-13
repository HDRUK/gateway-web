/** @jsx jsx */
import { jsx } from '@emotion/react';
import { useTable, Table as ReactTable } from 'react-table';
import styles from './Table.styles';

const Table = ({ columns, data }) => {
    const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } = useTable({
        columns,
        data,
    });

    <ReactTable {...getTableProps()} css={styles}>
        <thead>
            {headerGroups.map(headerGroup => (
                <tr {...headerGroup.getHeaderGroupProps()}>
                    {headerGroup.headers.map(column => (
                        <th {...column.getHeaderProps()}>{column.render('Header')}</th>
                    ))}
                </tr>
            ))}
        </thead>
        <tbody {...getTableBodyProps()}>
            {rows.map(row => {
                prepareRow(row);

                return (
                    <tr {...row.getRowProps()}>
                        {row.cells.map(cell => {
                            return <td {...cell.getCellProps()}>{cell.render('Cell')}</td>;
                        })}
                    </tr>
                );
            })}
        </tbody>
    </ReactTable>;
};

export default Table;
