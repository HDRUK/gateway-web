/** @jsxImportSource @emotion/react */

import {
    flexRender,
    getCoreRowModel,
    useReactTable,
    ColumnDef,
} from "@tanstack/react-table";
import { useCallback, useEffect, useRef } from "react";
import * as styles from "./Table.styles";

interface OnUpdateProps {
    rowIndex: number;
    columnId: string;
    value: unknown;
}

interface TableProps<T> {
    columns: ColumnDef<T, unknown>[];
    data: T[];
    onUpdate?: (
        data: T[],
        { rowIndex, columnId, value }: OnUpdateProps
    ) => void;
}

function useSkipper() {
    const shouldSkipRef = useRef(true);
    const shouldSkip = shouldSkipRef.current;

    // Wrap a function with this to skip a pagination reset temporarily
    const skip = useCallback(() => {
        shouldSkipRef.current = false;
    }, []);

    useEffect(() => {
        shouldSkipRef.current = true;
    });

    return [shouldSkip, skip] as const;
}

const Table = <T,>({ columns, data, onUpdate }: TableProps<T>) => {
    const [autoResetPageIndex, skipAutoResetPageIndex] = useSkipper();
    const table = useReactTable({
        data,
        columns,
        autoResetPageIndex,
        getCoreRowModel: getCoreRowModel(),
        meta: {
            updateData: (
                rowIndex: number,
                columnId: string,
                value: unknown
            ) => {
                if (typeof onUpdate !== "function") return;

                // Skip page index reset until after next rerender
                skipAutoResetPageIndex();

                const newData = data.map((row, index) => {
                    if (index === rowIndex) {
                        return {
                            ...data[rowIndex],
                            [columnId]: value,
                        };
                    }
                    return row;
                });
                onUpdate(newData, { rowIndex, columnId, value });
            },
        },
    });

    return (
        <table css={styles.table}>
            <thead>
                {table.getHeaderGroups().map(headerGroup => (
                    <tr key={headerGroup.id}>
                        {headerGroup.headers.map(header => (
                            <th css={styles.th} key={header.id}>
                                {header.isPlaceholder
                                    ? null
                                    : flexRender(
                                          header.column.columnDef.header,
                                          header.getContext()
                                      )}
                            </th>
                        ))}
                    </tr>
                ))}
            </thead>
            <tbody>
                {table.getRowModel().rows.map(row => (
                    <tr key={row.id}>
                        {row.getVisibleCells().map(cell => (
                            <td
                                css={styles.td}
                                key={cell.id}
                                style={{
                                    width: cell.column.getSize(),
                                }}>
                                {flexRender(
                                    cell.column.columnDef.cell,
                                    cell.getContext()
                                )}
                            </td>
                        ))}
                    </tr>
                ))}
            </tbody>
            <tfoot>
                {table.getFooterGroups().map(footerGroup => (
                    <tr key={footerGroup.id}>
                        {footerGroup.headers.map(header => (
                            <th key={header.id}>
                                {header.isPlaceholder
                                    ? null
                                    : flexRender(
                                          header.column.columnDef.footer,
                                          header.getContext()
                                      )}
                            </th>
                        ))}
                    </tr>
                ))}
            </tfoot>
        </table>
    );
};

Table.defaultProps = {
    onUpdate: () => null,
};

export default Table;
