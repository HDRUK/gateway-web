"use client";

import { useMemo } from "react";
import { Grid, TextareaAutosize, Typography } from "@mui/material";
import { useTranslations } from "next-intl";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { WidgetResponse } from "@/interfaces/Widget";
import Box from "@/components/Box";
import Button from "@/components/Button";
import Loading from "@/components/Loading";
import Paper from "@/components/Paper";
import useGet from "@/hooks/useGet";
import notificationService from "@/services/notification";
import apis from "@/config/apis";
import theme, { colors } from "@/config/theme";
import { RouteName } from "@/consts/routeName";
import WidgetDisplay from "@/widgets/WidgetDisplay";
import { TabValues } from "../../const";

interface WidgetPreviewProps {
    teamId?: string;
    widgetId?: number;
    widgetDomains?: string[];
}

const TRANSLATION_PATH = `pages.account.team.widgets.preview`;
const WIDGET_CODE_PATH = `${process.env.NEXT_PUBLIC_GATEWAY_URL}/widgets/`;
const CURRENT_DOMAIN = process.env.NEXT_PUBLIC_GATEWAY_URL;

const WidgetPreview = ({ teamId, widgetId }: WidgetPreviewProps) => {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const t = useTranslations(TRANSLATION_PATH);

    const changeTab = (targetTab: TabValues) => {
        const params = new URLSearchParams(searchParams);
        params.set("tab", targetTab);
        router.push(`${pathname}?${params.toString()}`, { scroll: false });
    };

    const cspHost = new URL(WIDGET_CODE_PATH).host;
    const currentUrl = new URL(CURRENT_DOMAIN!).host;

    const { data } = useGet<WidgetResponse>(
        `${apis.teamsV1Url}/${teamId}/widgets/${widgetId}/data?domain_origin=${currentUrl}`
    );

    const copyToClipboard = (str: string | undefined) => {
        navigator.clipboard.writeText(str || "");
        notificationService.apiSuccess(t("codeCopied"));
    };

    const generateWidgetCode = useMemo(() => {
        if (data) {
            return `<div style="position: relative; width: ${data?.widget.size_width}${data?.widget.unit}; height: ${data?.widget.size_height}${data?.widget.unit}; max-width: 100%;"><iframe title="HDR Gateway Widget" src="${WIDGET_CODE_PATH}${teamId}-${widgetId}" style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; border: 0;" allowfullscreen="true"></iframe></div>`;
        }
        return "";
    }, [data, teamId, widgetId]);

    return (
        <Paper sx={{ p: 3 }}>
            <Grid
                container
                spacing={2}
                columnSpacing={2}
                direction="row"
                alignItems="stretch">
                <Grid
                    size={{
                        mobile: 12,
                        laptop: 9,
                    }}
                    sx={{ overflow: "hidden" }}>
                    {data ? <WidgetDisplay data={data} /> : <Loading />}
                </Grid>
                <Grid
                    size={{
                        mobile: 12,
                        laptop: 3,
                    }}>
                    <Typography sx={{ fontWeight: 600, mb: 1 }} fontSize={16}>
                        {t("codeTitle")}
                    </Typography>
                    <Typography sx={{ mb: 2 }}>{t("codeIntro")}</Typography>

                    <TextareaAutosize
                        maxRows={20}
                        style={{
                            backgroundColor: colors.grey100,
                            border: 0,
                            width: "100%",
                            padding: theme.spacing(2),
                        }}
                        aria-label="Widget code"
                        defaultValue={generateWidgetCode}
                        readOnly
                    />
                    <Button
                        onClick={() => copyToClipboard(generateWidgetCode)}
                        sx={{ mt: 1 }}>
                        {t("copyCode")}
                    </Button>

                    <Typography
                        sx={{ fontWeight: 600, mt: 5, mb: 1 }}
                        fontSize={16}>
                        {t("cspTitle")}
                    </Typography>
                    <Typography sx={{ mb: 2 }}>{t("cspIntro")}</Typography>
                    <TextareaAutosize
                        maxRows={3}
                        style={{
                            backgroundColor: colors.grey100,
                            border: 0,
                            width: "100%",
                            padding: theme.spacing(2),
                        }}
                        aria-label="Widget code"
                        defaultValue={`frame-src 'self' ${cspHost};`}
                        readOnly
                    />
                </Grid>
            </Grid>

            <Box sx={{ mt: 4, p: 0, gap: 2, display: "flex" }}>
                <Button
                    onClick={() => changeTab(TabValues.CONFIGURATION)}
                    variant="outlined"
                    color="secondary">
                    {t("back")}
                </Button>
                <Button
                    color="inherit"
                    href={`/${RouteName.ACCOUNT}/${RouteName.TEAM}/${teamId}/${RouteName.INTEGRATIONS}/${RouteName.WIDGETS}`}>
                    {t("viewAll")}
                </Button>
            </Box>
        </Paper>
    );
};

export default WidgetPreview;
