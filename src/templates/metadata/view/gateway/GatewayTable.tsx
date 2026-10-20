"use client";

import { ReactNode, useMemo } from "react";
import { createColumnHelper } from "@tanstack/react-table";
import Table from "@/components/Table";
import { ObservationTableWrapper } from "@/app/[locale]/(logged-out)/dataset/[datasetId]/components/DatasetContent/DatasetContent.styles";

type Row = Record<string, ReactNode>;

export interface GatewayTableProps {
    columns: { key: string; header: ReactNode }[];
    /**
     * Cells are rendered on the server and passed down as elements: column
     * definitions hold functions, which cannot cross into a client component.
     */
    rows: Row[];
}

const columnHelper = createColumnHelper<Row>();

/** A metadata table drawn with the production page's observations table. */
const GatewayTable = ({ columns, rows }: GatewayTableProps) => {
    const definitions = useMemo(
        () =>
            columns.map(({ key, header }) =>
                columnHelper.display({
                    id: key,
                    header: () => header,
                    cell: ({ row: { original } }) => original[key],
                })
            ),
        [columns]
    );

    return (
        <ObservationTableWrapper>
            <Table<Row> columns={definitions} rows={rows} />
        </ObservationTableWrapper>
    );
};

export default GatewayTable;
