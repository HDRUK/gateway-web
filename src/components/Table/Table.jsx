/** @jsx jsx */
import { jsx } from '@emotion/react';
import PropTypes from 'prop-types';
import { useTable } from 'react-table';
import { cx } from '@emotion/css';
import useCommonStyles from '../../hooks/useCommonStyles';
import { COMMON_PROP_TYPES } from '../../configs/propTypes';
import styles from './Table.styles';

const Table = ({ className, columns, data, mt, mb, ml, mr, width, minWidth, maxWidth }) => {
    const commonStyles = useCommonStyles({ mt, mb, ml, mr, width, minWidth, maxWidth });

    const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } = useTable({
        columns,
        data,
    });

    return (
        <table {...getTableProps()} css={styles} className={cx([commonStyles, className])}>
            <thead>
                {headerGroups.map(headerGroup => (
                    <tr {...headerGroup.getHeaderGroupProps()}>
                        {headerGroup.headers.map(column => (
                            <th
                                {...column.getHeaderProps({
                                    style: { ...column.styles },
                                })}>
                                {column.render('Header')}
                            </th>
                        ))}
                    </tr>
                ))}
            </thead>
            <tbody {...getTableBodyProps()}>
                {rows.map(row => {
                    prepareRow(row);

                    return (
                        <tr {...row.getRowProps()}>
                            {row.cells.map((cell, i) => {
                                return (
                                    <td {...cell.getCellProps(cell.column.cellProps)} data-label={headerGroups[0].headers[i].id}>
                                        {cell.render('Cell')}
                                    </td>
                                );
                            })}
                        </tr>
                    );
                })}
            </tbody>
        </table>
    );
};

Table.propTypes = {
    columns: PropTypes.arrayOf(
        PropTypes.shape({
            Header: PropTypes.node,
            accessor: PropTypes.string,
        })
    ),
    data: PropTypes.arrayOf(PropTypes.object),
    ...COMMON_PROP_TYPES,
};

Table.defaultProps = {
    columns: [],
    data: [],
    width: '100%',
};

export default Table;
