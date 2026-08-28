"use client";

import { useMemo, useState } from "react";
import { useTranslations } from "next-intl";
import { Divider, Skeleton } from "@mui/material";
import Box from "@/components/Box";
import Paper from "@/components/Paper";
import Typography from "@/components/Typography";
import { Button } from "@hdruk/ui";
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

export enum ViewMode {
    LIST = "list",
    CREATE = "create",
    EDIT = "edit",
}

type View =
    | { mode: ViewMode.LIST }
    | { mode: ViewMode.CREATE }
    | { mode: ViewMode.EDIT; networkId: number };

const TRANSLATION_PATH = "pages.account.profile.searchAdmin";

export default function DataCustodianNetworksTab() {
    const t = useTranslations(TRANSLATION_PATH);
    const [view, setView] = useState<View>({ mode: ViewMode.LIST });
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

    if (view.mode === ViewMode.CREATE) {
        return (
            <DataCustodianNetworkForm
                onDone={() => {
                    setView({ mode: ViewMode.LIST });
                    mutate();
                }}
                onCancel={() => setView({ mode: ViewMode.LIST })}
            />
        );
    }

    if (view.mode === ViewMode.EDIT) {
        return (
            <DataCustodianNetworkForm
                networkId={view.networkId}
                onDone={() => {
                    setView({ mode: ViewMode.LIST });
                    mutate();
                }}
                onCancel={() => setView({ mode: ViewMode.LIST })}
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
                <Typography variant="h3">
                    {t("dataCustodianNetworksTitle")}
                </Typography>
                <Button
                    size="small"
                    onClick={() => setView({ mode: ViewMode.CREATE })}>
                    {t("createNetwork")}
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
                        {t("noNetworksFound")}
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
                                        {t("memberTeamCount", {
                                            count: network.teams?.length ?? 0,
                                        })}
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
                                                ? t("enabled")
                                                : t("disabled")
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
                                                label: t("edit"),
                                                icon: EditIcon,
                                                action: () =>
                                                    setView({
                                                        mode: ViewMode.EDIT,
                                                        networkId: Number(
                                                            network.id
                                                        ),
                                                    }),
                                            },
                                            {
                                                label: t("delete"),
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
