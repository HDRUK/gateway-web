"use client";

import { useMemo, useRef, useState } from "react";
import { Button } from "@hdruk/ui";
import { tokens } from "@hdruk/ui/theme";
import { Box, Typography } from "@mui/material";
import {
    WidgetEntityData,
    WidgetCategory,
    WidgetBranding,
    DatasetItem,
    CollectionItem,
    ScriptItem,
    DataUseItem,
} from "@/interfaces/Widget";
import theme from "@/config/theme";
import { FULL_GATEWAY_URL } from "@/consts/urls";
import CategoryMenu from "./components/CategoryMenu";
import CollectionsGrid from "./components/CollectionGrid";
import DataUsesList from "./components/DataUsesList";
import DatasetsList from "./components/DatasetsList";
import Header from "./components/Header";
import ScriptsList from "./components/ScriptsList";
import { CATEGORIES } from "./consts";
import useResultsByType from "./hooks/useResultsByType";

const TRANSLATIONS = {
    footerTtle: "Want to dig deeper?",
    footerDesc:
        "Cohort Discovery indentifies relevant populations across datasets",
    cohortButton: "Open Cohort Discovery",
    noData: "No data was selected for this widget",
};

type WidgetDisplayProps = { data: WidgetEntityData; isIframe?: boolean };

const isValidColor = (value?: string) =>
    typeof value === "string" && value.trim() !== "#" && value.trim() !== "";

export default function WidgetDisplay({
    data,
    isIframe = false,
}: WidgetDisplayProps) {
    const {
        include_cohort_link,
        include_search_bar,
        size_height,
        size_width,
        unit,
        branding_primary,
        branding_secondary,
        branding_neutral,
    } = data.widget;

    const [entityType, setEntityType] = useState<WidgetCategory>("datasets");
    const [menuAnchor, setMenuAnchor] = useState<HTMLElement | null>(null);
    const [searchValue, setSearchValue] = useState("");

    const resultsByType = useResultsByType(data, searchValue);
    const widgetContainer = useRef<HTMLDivElement | null>(null);

    const branding = useMemo<WidgetBranding>(
        () => ({
            primary: isValidColor(branding_primary)
                ? branding_primary
                : undefined,
            secondary: isValidColor(branding_secondary)
                ? branding_secondary
                : undefined,
            neutral: isValidColor(branding_neutral)
                ? branding_neutral
                : undefined,
        }),
        [branding_primary, branding_secondary, branding_neutral]
    );

    const filteredMenuCategories = useMemo(
        () => CATEGORIES.filter(category => data?.[category].length > 0),
        [data]
    );

    const activeType = filteredMenuCategories.includes(entityType)
        ? entityType
        : filteredMenuCategories[0];

    const renderedContent = useMemo(() => {
        if (!activeType) {
            return (
                <Box sx={{ p: 4, textAlign: "center" }}>
                    <Typography variant="subtitle1" component="p">
                        {TRANSLATIONS.noData}
                    </Typography>
                </Box>
            );
        }

        const results = resultsByType[activeType];

        switch (activeType) {
            case "datasets":
                return (
                    <DatasetsList
                        items={results as DatasetItem[]}
                        branding={branding}
                    />
                );
            case "collections":
                return (
                    <CollectionsGrid
                        items={results as CollectionItem[]}
                        branding={branding}
                    />
                );
            case "scripts":
                return (
                    <ScriptsList
                        items={results as ScriptItem[]}
                        branding={branding}
                    />
                );
            default:
                return (
                    <DataUsesList
                        items={results as DataUseItem[]}
                        branding={branding}
                    />
                );
        }
    }, [activeType, resultsByType, branding]);

    return (
        <Box
            data-testid="widget-display"
            sx={{
                width: isIframe ? "100%" : `${size_width}${unit}`,
                height: `${size_height}${unit}`,
                overflow: "hidden",
                backgroundColor: branding_neutral ?? theme.palette.grey[100],
                color: tokens.text.primaryBlack,
            }}
            ref={widgetContainer}>
            <Box
                sx={{
                    display: "flex",
                    flexDirection: "column",
                    height: "100%",
                    p: 0,
                }}>
                <Header
                    includeSearch={!!include_search_bar}
                    gatewayUrl={FULL_GATEWAY_URL}
                    searchValue={searchValue}
                    setSearchValue={setSearchValue}
                    branding={branding}
                />

                {activeType && (
                    <CategoryMenu
                        value={activeType}
                        options={filteredMenuCategories}
                        onChange={setEntityType}
                        menuAnchor={menuAnchor}
                        setMenuAnchor={setMenuAnchor}
                        containerRef={widgetContainer}
                        branding={branding}
                    />
                )}

                <Box sx={{ flex: 1, overflow: "auto", mb: 1, p: 0 }}>
                    {renderedContent}
                </Box>

                {!!include_cohort_link && (
                    <Box
                        component="footer"
                        sx={{
                            backgroundColor: branding_neutral ?? tokens.status.hovered,
                            display: "flex",
                            flexDirection: "row",
                            justifyContent: "space-between",
                            alignItems: "center",
                            gap: 2,
                            p: 1,
                        }}>
                        <Typography>
                            <Typography
                                component="span"
                                sx={{ fontWeight: 600 }}>
                                {TRANSLATIONS.footerTtle}{" "}
                            </Typography>
                            {TRANSLATIONS.footerDesc}
                        </Typography>
                        <Button
                            variant="text"
                            component="a"
                            href={`${FULL_GATEWAY_URL}/about/cohort-discovery`}
                            target="_blank"
                            rel="noopener noreferrer"
                            sx={{
                                backgroundColor: tokens.background.white,
                                flexShrink: 0,
                            }}
                            color="greyCustom"
                            disableElevation>
                            {TRANSLATIONS.cohortButton}
                        </Button>
                    </Box>
                )}
            </Box>
        </Box>
    );
}
