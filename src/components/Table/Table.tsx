/** @jsxImportSource @emotion/react */
import { CSSProperties, useCallback, useEffect, useRef } from "react";
import {
    flexRender,
    getCoreRowModel,
    useReactTable,
    ColumnDef,
    Column,
} from "@tanstack/react-table";
import { colors } from "@/config/theme";
import ActionDropdown from "@/app/[locale]/(logged-out)/search/components/ActionDropdown";
import * as styles from "./Table.styles";

interface OnUpdateProps {
    rowIndex: number;
    columnId: string;
    value: unknown;
}

interface TableProps<T> {
    defaultColumn?: {
        size?: number;
        minSize?: number;
        maxSize?: number;
    };
    columns: ColumnDef<T, unknown>[];
    rows: T[];
    onUpdate?: (
        rows: T[],
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

const getCommonCellStyles = <T,>(column: Column<T>): CSSProperties => {
    const {
        columnDef: { meta = {} },
    } = column;

    const { isPinned, hasPinnedBorder } = meta as {
        isPinned?: boolean;
        hasPinnedBorder?: boolean;
    };

    return {
        backgroundColor: isPinned ? colors.grey100 : "white",
        boxShadow: hasPinnedBorder ? `1px 0 ${colors.grey300}` : undefined,
        left: isPinned ? `${column.getStart()}px` : undefined,
        opacity: isPinned ? 0.95 : 1,
        position: isPinned ? "sticky" : "relative",
        width: column.getSize(),
        zIndex: isPinned ? 1 : 0,
    };
};

const Table = <T,>({
    columns,
    rows,
    onUpdate,
    defaultColumn,
}: TableProps<T>) => {
    const [autoResetPageIndex, skipAutoResetPageIndex] = useSkipper();
    const table = useReactTable(
        {
            data: rows,
            columns,
            defaultColumn,
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

                    const newData = rows.map((row, index) => {
                        if (index === rowIndex) {
                            return {
                                ...rows[rowIndex],
                                [columnId]: value,
                            };
                        }
                        return row;
                    });
                    onUpdate(newData, { rowIndex, columnId, value });
                },
            },
        },
        hooks => {
            hooks.visibleColumns.push(columns => [
                {
                    id: "checkinout",
                    Header: "CheckIn/Out",
                    // eslint-disable-next-line react/no-unstable-nested-components, react/prop-types
                    Cell: ({ row }) => <ActionDropdown {...row} />,
                },
                ...columns,
            ]);
        }
    );

    const hasFooterContent = !!table
        .getFooterGroups()
        .map(group =>
            group.headers.map(header => header.column.columnDef.footer)
        )
        .flat()
        .filter(Boolean).length;

    return (
        <table css={styles.table}>
            <thead>
                {table.getHeaderGroups().map(headerGroup => (
                    <tr key={headerGroup.id}>
                        {headerGroup.headers.map(header => (
                            <th
                                css={styles.th}
                                key={header.id}
                                style={{
                                    ...getCommonCellStyles(header.column),
                                }}>
                                <div className="whitespace-nowrap">
                                    {header.isPlaceholder
                                        ? null
                                        : flexRender(
                                              header.column.columnDef.header,
                                              header.getContext()
                                          )}
                                </div>
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
                                    ...getCommonCellStyles(cell.column),
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
            {hasFooterContent && (
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
            )}
        </table>
    );
};

export default Table;
