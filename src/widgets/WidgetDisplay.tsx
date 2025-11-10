"use client";

/* eslint-disable @next/next/no-img-element */

/* eslint-disable @next/next/no-page-custom-font */
import { useRef, useState } from "react";
import {
    Box,
    Button,
    GlobalStyles,
    CssBaseline,
    ThemeProvider,
    Typography,
} from "@mui/material";
import {
    WidgetEntityData,
    WidgetCategory,
    DatasetItem,
    CollectionItem,
    ScriptItem,
    DataUseItem,
} from "@/interfaces/Widget";
import theme, { colors } from "@/config/theme";
import CategoryMenu from "./components/CategoryMenu";
import CollectionsGrid from "./components/CollectionGrid";
import DataUsesList from "./components/DataUsesList";
import DatasetsList from "./components/DatasetsList";
import Header from "./components/Header";
import ScriptsList from "./components/ScriptsList";
import { CATEGORIES } from "./consts";
import useResultsByType from "./hooks/useResultsByType";

const GATEWAY_URL = "https://healthdatagateway.org/en";

const TRANSLATIONS = {
    footerTtle: "Want to dig deeper?",
    footerDesc:
        "Cohort Discovery indentifies relevant populations across datasets",
    cohortButton: "Open Cohort Discovery",
};

type WidgetDisplayProps = { data: WidgetEntityData };

export default function WidgetDisplay({ data }: WidgetDisplayProps) {
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
        <>
            <link
                href="https://fonts.googleapis.com/css2?family=Source+Sans+3:wght@400;600&display=swap&subset=latin"
                rel="stylesheet"
            />
            <ThemeProvider theme={theme}>
                <GlobalStyles
                    styles={{
                        body: {
                            width: "100%",
                            display: "flex",
                            flexDirection: "column",
                            minHeight: "100vh",
                        },
                    }}
                />
                <CssBaseline />
                <Box
                    sx={{
                        width: `${size_width}${unit}`,
                        height: `${size_height}${unit}`,
                        maxWidth: "100%",
                        overflow: "hidden",
                        backgroundColor: theme.palette.grey[100],
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
                            gatewayUrl={GATEWAY_URL}
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
                                        sx={{ fontWeight: 600, mr: 1 }}>
                                        {TRANSLATIONS.footerTtle}
                                    </Typography>
                                    {TRANSLATIONS.footerDesc}
                                </Typography>
                                <Button
                                    href={`${GATEWAY_URL}/about/cohort-discovery`}
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
            </ThemeProvider>
        </>
    );
}
