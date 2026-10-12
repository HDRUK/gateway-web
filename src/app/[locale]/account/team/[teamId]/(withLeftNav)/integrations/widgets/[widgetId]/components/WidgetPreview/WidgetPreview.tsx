"use client";

import { useMemo, useState } from "react";
import { Button, Loading } from "@hdruk/ui";
import { tokens } from "@hdruk/ui/theme";
import { Grid, Tab, Tabs, TextareaAutosize, Typography } from "@mui/material";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { WidgetEntityData } from "@/interfaces/Widget";
import Box from "@/components/Box";
import Paper from "@/components/Paper";
import useGet from "@/hooks/useGet";
import notificationService from "@/services/notification";
import apis from "@/config/apis";
import theme from "@/config/theme";
import { RouteName } from "@/consts/routeName";
import WidgetDisplay from "@/widgets/WidgetDisplay";
import { CodeFormat, TabValues } from "../../const";
import { generateCspDirective, generateWidgetCode } from "./utils";

interface WidgetPreviewProps {
    teamId?: string;
    widgetId?: number;
    widgetDomains?: string[];
}

const TRANSLATION_PATH = `pages.account.team.widgets.preview`;
const GATEWAY_URL = process.env.NEXT_PUBLIC_GATEWAY_URL!;

const WidgetPreview = ({ teamId, widgetId }: WidgetPreviewProps) => {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const t = useTranslations(TRANSLATION_PATH);
    const [codeFormat, setCodeFormat] = useState(CodeFormat.HTML);

    const changeTab = (targetTab: TabValues) => {
        const params = new URLSearchParams(searchParams);
        params.set("tab", targetTab);
        router.push(`${pathname}?${params.toString()}`, { scroll: false });
    };

    const currentUrl = new URL(GATEWAY_URL).host;

    const { data } = useGet<WidgetEntityData>(
        `${apis.teamsV1Url}/${teamId}/widgets/${widgetId}/data?domain_origin=${currentUrl}`
    );

    const copyToClipboard = (str: string | undefined) => {
        navigator.clipboard.writeText(str || "");
        notificationService.apiSuccess(t("codeCopied"));
    };

    const widgetCode = useMemo(
        () =>
            generateWidgetCode({
                data,
                teamId,
                widgetId,
                gatewayUrl: GATEWAY_URL,
                format: codeFormat,
            }),
        [codeFormat, data, teamId, widgetId]
    );

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
                        xs: 12,
                        md: 9,
                    }}
                    sx={{ overflow: "hidden" }}>
                    {data ? <WidgetDisplay data={data} /> : <Loading />}
                </Grid>
                <Grid
                    size={{
                        xs: 12,
                        md: 3,
                    }}>
                    <Typography sx={{ fontWeight: 600, mb: 1 }} fontSize={16}>
                        {t("codeTitle")}
                    </Typography>
                    <Typography sx={{ mb: 2 }}>{t("codeIntro")}</Typography>

                    <Tabs
                        value={codeFormat}
                        onChange={(_, value: CodeFormat) =>
                            setCodeFormat(value)
                        }
                        aria-label={t("codeFormat")}>
                        <Tab
                            value={CodeFormat.HTML}
                            label={t("formatHtml")}
                            id={`widget-code-tab-${CodeFormat.HTML}`}
                            aria-controls="widget-code-panel"
                        />
                        <Tab
                            value={CodeFormat.REACT}
                            label={t("formatReact")}
                            id={`widget-code-tab-${CodeFormat.REACT}`}
                            aria-controls="widget-code-panel"
                        />
                    </Tabs>
                    <div
                        role="tabpanel"
                        id="widget-code-panel"
                        aria-labelledby={`widget-code-tab-${codeFormat}`}>
                        <TextareaAutosize
                            maxRows={20}
                            style={{
                                backgroundColor: tokens.background.primary,
                                border: 0,
                                width: "100%",
                                padding: theme.spacing(2),
                            }}
                            aria-label="Widget code"
                            value={widgetCode}
                            readOnly
                        />
                    </div>
                    <Button
                        onClick={() => copyToClipboard(widgetCode)}
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
                            backgroundColor: tokens.background.primary,
                            border: 0,
                            width: "100%",
                            padding: theme.spacing(2),
                        }}
                        aria-label="Widget code"
                        defaultValue={generateCspDirective(GATEWAY_URL)}
                        readOnly
                    />
                </Grid>
            </Grid>

            <Box sx={{ mt: 4, p: 0, gap: 2, display: "flex" }}>
                <Button
                    onClick={() => changeTab(TabValues.CONFIGURATION)}
                    purpose="secondary">
                    {t("back")}
                </Button>
                <Button
                    component={Link}
                    color="inherit"
                    href={`/${RouteName.ACCOUNT}/${RouteName.TEAM}/${teamId}/${RouteName.INTEGRATIONS}/${RouteName.WIDGETS}`}>
                    {t("viewAll")}
                </Button>
            </Box>
        </Paper>
    );
};

export default WidgetPreview;
