"use client";

import { useMemo, useState } from "react";
import { Divider, Skeleton } from "@mui/material";
import Box from "@/components/Box";
import Paper from "@/components/Paper";
import Typography from "@/components/Typography";
import Button from "@/components/Button";
import Chip from "@/components/Chip";
import ActionMenu from "@/components/ActionMenu";
import useGet from "@/hooks/useGet";
import useDialog from "@/hooks/useDialog";
import apis from "@/config/apis";
import { EditIcon, DeleteForeverIcon } from "@/consts/icons";
import { DataCustodianNetworkListItem } from "@/interfaces/DataCustodianNetwork";
import { PaginationType } from "@/interfaces/Pagination";
import { GlobalDialogContextProps } from "@/providers/DialogProvider";
import DataCustodianNetworkForm from "./DataCustodianNetworkForm";
import DeleteDataCustodianNetworkDialog from "./DeleteDataCustodianNetworkDialog";

type View =
    | { mode: "list" }
    | { mode: "create" }
    | { mode: "edit"; networkId: number };

export default function DataCustodianNetworksTab() {
    const [view, setView] = useState<View>({ mode: "list" });
    const { showDialog } = useDialog() as GlobalDialogContextProps;

    const { data, isLoading, mutate } = useGet<
        PaginationType<DataCustodianNetworkListItem>
    >(`${apis.adminDataCustodianNetworksV2Url}?per_page=1000`, {
        withPagination: true,
    });

    const networks = useMemo(() => data?.list ?? [], [data]);

    const handleDelete = (network: DataCustodianNetworkListItem) => {
        showDialog(DeleteDataCustodianNetworkDialog, {
            networkId: Number(network.id),
            networkName: network.name,
            callback: mutate,
        });
    };

    if (view.mode === "create") {
        return (
            <DataCustodianNetworkForm
                onDone={() => {
                    setView({ mode: "list" });
                    mutate();
                }}
                onCancel={() => setView({ mode: "list" })}
            />
        );
    }

    if (view.mode === "edit") {
        return (
            <DataCustodianNetworkForm
                networkId={view.networkId}
                onDone={() => {
                    setView({ mode: "list" });
                    mutate();
                }}
                onCancel={() => setView({ mode: "list" })}
            />
        );
    }

    return (
        <Box sx={{ p: 0 }}>
            <Box
                sx={{
                    display: "flex",
                    flexWrap: "wrap",
                    justifyContent: "space-between",
                    alignItems: "center",
                    gap: 1,
                    p: 0,
                    mb: 2,
                }}>
                <Typography variant="h3">Data Custodian Networks</Typography>
                <Button
                    size="small"
                    onClick={() => setView({ mode: "create" })}>
                    Create network
                </Button>
            </Box>

            {isLoading && (
                <Paper variant="outlined" sx={{ p: 2 }}>
                    <Skeleton variant="rounded" height={40} sx={{ mb: 1 }} />
                    <Skeleton variant="rounded" height={40} />
                </Paper>
            )}

            {!isLoading && networks.length === 0 && (
                <Paper variant="outlined" sx={{ p: 2 }}>
                    <Typography variant="body2" color="text.secondary">
                        No Data Custodian Networks found.
                    </Typography>
                </Paper>
            )}

            {!isLoading && networks.length > 0 && (
                <Paper variant="outlined">
                    {networks.map((network, index) => (
                        <Box key={network.id}>
                            <Box
                                sx={{
                                    p: 2,
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "space-between",
                                    gap: 2,
                                    flexWrap: "wrap",
                                }}>
                                <Box sx={{ p: 0, minWidth: 0 }}>
                                    <Typography
                                        sx={{ wordBreak: "break-word" }}>
                                        {network.name}
                                    </Typography>
                                    <Typography
                                        variant="body2"
                                        color="text.secondary">
                                        {network.teams?.length ?? 0} member
                                        team
                                        {network.teams?.length === 1
                                            ? ""
                                            : "s"}
                                    </Typography>
                                </Box>
                                <Box
                                    sx={{
                                        p: 0,
                                        display: "flex",
                                        alignItems: "center",
                                        gap: 1,
                                    }}>
                                    <Chip
                                        label={
                                            network.enabled
                                                ? "Enabled"
                                                : "Disabled"
                                        }
                                        color={
                                            network.enabled
                                                ? "success"
                                                : "greyCustom"
                                        }
                                        size="small"
                                    />
                                    <ActionMenu
                                        actions={[
                                            {
                                                label: "Edit",
                                                icon: EditIcon,
                                                action: () =>
                                                    setView({
                                                        mode: "edit",
                                                        networkId: Number(
                                                            network.id
                                                        ),
                                                    }),
                                            },
                                            {
                                                label: "Delete",
                                                icon: DeleteForeverIcon,
                                                action: () =>
                                                    handleDelete(network),
                                            },
                                        ]}
                                    />
                                </Box>
                            </Box>
                            {index < networks.length - 1 && <Divider />}
                        </Box>
                    ))}
                </Paper>
            )}
        </Box>
    );
}
