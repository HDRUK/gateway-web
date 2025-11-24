"use client";

import { useRef, useState } from "react";
import { Box, Button, Typography } from "@mui/material";
import {
    WidgetEntityData,
    WidgetCategory,
    DatasetItem,
    CollectionItem,
    ScriptItem,
    DataUseItem,
} from "@/interfaces/Widget";
import theme, { colors } from "@/config/theme";
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
};

type WidgetDisplayProps = { data: WidgetEntityData; isIframe?: boolean };

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
    } = data.widget;

    const [entityType, setEntityType] = useState<WidgetCategory>("datasets");
    const [menuAnchor, setMenuAnchor] = useState<HTMLElement | null>(null);
    const [searchValue, setSearchValue] = useState("");

    const resultsByType = useResultsByType(data, searchValue);
    const widgetContainer = useRef<HTMLDivElement | null>(null);

    const renderByType = () => {
        const results = resultsByType[entityType];
        switch (entityType) {
            case "datasets":
                return <DatasetsList items={results as DatasetItem[]} />;
            case "collections":
                return <CollectionsGrid items={results as CollectionItem[]} />;
            case "scripts":
                return <ScriptsList items={results as ScriptItem[]} />;
            default:
                return <DataUsesList items={results as DataUseItem[]} />;
        }
    };

    const filteredMenuCategories = CATEGORIES.filter(
        category => data?.[category].length > 0
    );

    return (
        <Box
            sx={{
                width: isIframe ? "100%" : `${size_width}${unit}`,
                height: `${size_height}${unit}`,
                overflow: "hidden",
                backgroundColor: theme.palette.grey[100],
                color: colors.grey900,
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
                />

                <CategoryMenu
                    value={entityType}
                    options={filteredMenuCategories}
                    onChange={setEntityType}
                    menuAnchor={menuAnchor}
                    setMenuAnchor={setMenuAnchor}
                    containerRef={widgetContainer}
                />

                <Box sx={{ flex: 1, overflow: "auto", mb: 1, p: 0 }}>
                    {renderByType()}
                </Box>

                {!!include_cohort_link && (
                    <Box
                        component="footer"
                        sx={{
                            backgroundColor: colors.grey200,
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
                            href={`${FULL_GATEWAY_URL}/about/cohort-discovery`}
                            target="_blank"
                            sx={{
                                backgroundColor: colors.white,
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
