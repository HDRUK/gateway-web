"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { useParams } from "next/navigation";
import { tokens } from "@hdruk/ui/theme";
import { FederationRunStatus } from "@/interfaces/Federation";
import { Integration } from "@/interfaces/Integration";
import Box from "@/components/Box";
import CardActions from "@/components/CardActions";
import Chip from "@/components/Chip";
import KeyValueList from "@/components/KeyValueList";
import Paper from "@/components/Paper";
import Typography from "@/components/Typography";
import apis from "@/config/apis";
import {
    AutorenewIcon,
    EditIcon,
    HistoryIcon,
    PlayArrowIcon,
} from "@/consts/icons";
import { RouteName } from "@/consts/routeName";
import apiService from "@/services/api";
import { formatDate } from "@/utils/date";
import { toTitleCase } from "@/utils/string";

interface IntegrationListItemProps {
    index: number;
    integration: Integration;
    onChanged?: () => void;
}

const IntegrationListItem = ({
    index,
    integration,
    onChanged,
}: IntegrationListItemProps) => {
    const t = useTranslations("api");
    const params = useParams<{ teamId: string }>();
    const [runStatus, setRunStatus] = useState(FederationRunStatus.IDLE);

    const detailPath = `/${RouteName.ACCOUNT}/${RouteName.TEAM}/${params?.teamId}/${RouteName.INTEGRATIONS}/${RouteName.INTEGRATION}/${RouteName.LIST}`;

    const handleRunNow = async () => {
        setRunStatus(FederationRunStatus.RUNNING);

        const response = await apiService.getRequest(
            `${apis.teamsV1Url}/${params?.teamId}/federations/${integration.id}/run`,
            { notificationOptions: { itemName: "Integration", t } }
        );

        setRunStatus(FederationRunStatus.IDLE);
        if (response !== null) {
            onChanged?.();
        }
    };

    const inProgress =
        integration.is_running || runStatus === FederationRunStatus.RUNNING;

    const runIcon = inProgress ? AutorenewIcon : PlayArrowIcon;
    const runLabel = inProgress ? "Running" : "Run now";

    const actions = [
        { href: detailPath, icon: EditIcon, label: "Edit" },
        {
            action: handleRunNow,
            icon: runIcon,
            disabled: inProgress || !integration.enabled || !integration.tested,
            label: runLabel,
        },
        {
            href: detailPath,
            icon: HistoryIcon,
            label: "History",
            query: { tab: "history" },
        },
    ];

    return (
        <Paper sx={{ m: 0, width: "100%" }}>
            <Box sx={{ display: "grid", gridTemplateColumns: "1fr 50px" }}>
                <Box sx={{ p: 2 }}>
                    <Box
                        sx={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                            mb: 1,
                        }}>
                        <Typography sx={{ fontWeight: "bold", fontSize: 14 }}>
                            Integration {index}
                        </Typography>
                        {integration.error ? (
                            <Chip label="Disabled on error" color="error" />
                        ) : integration.enabled ? (
                            <Chip label="Enabled" color="success" />
                        ) : (
                            <Chip label="Disabled" color="error" />
                        )}
                    </Box>
                    <KeyValueList
                        rows={[
                            {
                                key: "Type",
                                value: toTitleCase(integration.federation_type),
                            },
                            {
                                key: "Created",
                                value: formatDate(
                                    integration.created_at,
                                    "DD MMMM YYYY HH:mm"
                                ),
                            },
                            {
                                key: "Last run",
                                value: integration.last_run_at
                                    ? formatDate(
                                          integration.last_run_at,
                                          "DD MMMM YYYY HH:mm"
                                      )
                                    : "Never",
                            },
                            ...(integration.error
                                ? [
                                      {
                                          key: "Error",
                                          value: integration.error_text,
                                          color: tokens.status.error,
                                      },
                                  ]
                                : []),
                        ]}
                    />
                </Box>
                <Box
                    sx={{
                        p: 0,
                        borderLeft: `solid 1px ${tokens.status.faded}`,
                    }}>
                    <CardActions actions={actions} id={integration.id} />
                </Box>
            </Box>
        </Paper>
    );
};

export default IntegrationListItem;
