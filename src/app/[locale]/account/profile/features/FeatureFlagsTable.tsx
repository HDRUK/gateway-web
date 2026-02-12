"use client";

import { useMemo } from "react";
import { Switch } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import useGet from "@/hooks/useGet";
import usePut from "@/hooks/usePut";
import apis from "@/config/apis";
import { FeatureFlagsResponse } from "@/utils/gatewayFlagAdapter";

interface Feature {
    name: string;
    value: boolean;
}

export default function FeatureFlagsTable({ userId }: { userId?: string }) {
    const url = userId ? `${apis.features}/users/${userId}` : apis.features;

    const { data, isLoading, mutate } = useGet<FeatureFlagsResponse>(url);

    const features: Feature[] = useMemo(
        () =>
            Object.entries(data ?? []).map(([name, value]) => ({
                name,
                value,
            })),
        [data]
    );

    const toggle = usePut(url);

    const columns = [
        {
            field: "name",
            headerName: "Feature",
            flex: 1,
        },
        {
            field: "value",
            headerName: "Enabled",
            width: 150,
            sortable: false,
            renderCell: ({ row }: { row: Feature }) => {
                const isEnabled = !!row.value;

                return (
                    <Switch
                        checked={isEnabled}
                        onChange={e => toggle(row.name, null).then(mutate)}
                    />
                );
            },
        },
    ];

    return (
        <div style={{ height: 400, width: "100%" }}>
            <DataGrid
                getRowId={row => row.name}
                rows={features}
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
