"use client";

import { useMemo } from "react";
import { Switch } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import useGet from "@/hooks/useGet";
import usePut from "@/hooks/usePut";
import apis from "@/config/apis";
import { Feature, FeatureFlagsResponse } from "@/utils/gatewayFlagAdapter";

export default function FeatureFlagsTable() {
    const { data, isLoading, mutate } = useGet<FeatureFlagsResponse>(
        apis.features
    );
    const toggle = usePut(apis.features);

    const columns = [
        {
            field: "name",
            headerName: "Feature",
            flex: 1,
        },
        {
            field: "enabled",
            headerName: "Enabled",
            width: 150,
            sortable: false,
            renderCell: ({ row }: { row: Feature }) => {
                const isEnabled = row.value === "true";

                return (
                    <Switch
                        checked={isEnabled}
                        onChange={e => toggle(row.id, null).then(mutate)}
                    />
                );
            },
        },
    ];

    return (
        <div style={{ height: 400, width: "100%" }}>
            <DataGrid
                rows={data}
                columns={columns}
                loading={isLoading}
                hideFooter
                disableRowSelectionOnClick
                slotProps={{
                    loadingOverlay: {
                        variant: "skeleton",
                        noRowsVariant: "skeleton",
                    },
                }}
            />
        </div>
    );
}
