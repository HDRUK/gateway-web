"use client";

import { useEffect, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { useParams } from "next/navigation";
import { FederationRunStatus } from "@/interfaces/Federation";
import { Integration } from "@/interfaces/Integration";
import Box from "@/components/Box";
import CardActions from "@/components/CardActions";
import Chip from "@/components/Chip";
import KeyValueList from "@/components/KeyValueList";
import Paper from "@/components/Paper";
import Typography from "@/components/Typography";
import apis from "@/config/apis";
import { colors } from "@/config/theme";
import {
    AutorenewIcon,
    CheckIcon,
    EditIcon,
    HistoryIcon,
    PlayArrowIcon,
} from "@/consts/icons";
import { RouteName } from "@/consts/routeName";
import apiService from "@/services/api";
import { formatDate } from "@/utils/date";
import { toTitleCase } from "@/utils/string";

const MIN_RUNNING_DISPLAY_MS = 600;
const COMPLETE_DISPLAY_MS = 3000;

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
    const revertTimeoutRef = useRef<ReturnType<typeof setTimeout>>();

    useEffect(() => {
        return () => clearTimeout(revertTimeoutRef.current);
    }, []);

    const detailPath = `/${RouteName.ACCOUNT}/${RouteName.TEAM}/${params?.teamId}/${RouteName.INTEGRATIONS}/${RouteName.INTEGRATION}/${RouteName.LIST}`;

    const handleRunNow = async () => {
        setRunStatus(FederationRunStatus.RUNNING);

        const minDisplay = new Promise(resolve =>
            setTimeout(resolve, MIN_RUNNING_DISPLAY_MS)
        );
        const [response] = await Promise.all([
            apiService.getRequest(
                `${apis.teamsV1Url}/${params?.teamId}/federations/${integration.id}/run`,
                { notificationOptions: { itemName: "Integration", t } }
            ),
            minDisplay,
        ]);

        setRunStatus(
            response !== null
                ? FederationRunStatus.COMPLETE
                : FederationRunStatus.IDLE
        );
        if (response !== null) {
            onChanged?.();
            revertTimeoutRef.current = setTimeout(
                () => setRunStatus(FederationRunStatus.IDLE),
                COMPLETE_DISPLAY_MS
            );
        }
    };

    const runIcon =
        runStatus === FederationRunStatus.RUNNING
            ? AutorenewIcon
            : runStatus === FederationRunStatus.COMPLETE
            ? CheckIcon
            : PlayArrowIcon;

    const runLabel =
        runStatus === FederationRunStatus.RUNNING
            ? "Running"
            : runStatus === FederationRunStatus.COMPLETE
            ? "Complete"
            : "Run now";

    const actions = [
        { href: detailPath, icon: EditIcon, label: "Edit" },
        {
            action: handleRunNow,
            icon: runIcon,
            disabled:
                runStatus !== FederationRunStatus.IDLE ||
                !integration.enabled ||
                !integration.tested,
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
                                          color: colors.red700,
                                      },
                                  ]
                                : []),
                        ]}
                    />
                </Box>
                <Box sx={{ borderLeft: `solid 1px ${colors.grey600}` }}>
                    <CardActions actions={actions} id={integration.id} />
                </Box>
            </Box>
        </Paper>
    );
};

export default IntegrationListItem;
