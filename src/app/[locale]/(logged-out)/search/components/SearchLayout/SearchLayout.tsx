"use client";

import { KeyboardEvent, MouseEvent, ReactNode, useState } from "react";
import { Box, Drawer, IconButton, useTheme } from "@mui/material";
import { useTranslations } from "next-intl";
import { CloseIcon, PanelExpandIcon } from "@/consts/icons";
import {
    filterSidebar,
    filterSidebarContent,
    filterSidebarPaper,
    filterSidebarToggle,
    filterSidebarToggleIcon,
    layoutBody,
    layoutRoot,
    mainContent,
    mobileDrawerClose,
    mobileDrawerContent,
} from "./SearchLayout.styles";

const TRANSLATION_PATH = "pages.search";

interface SearchLayoutProps {
    isMobile: boolean;
    header: ReactNode;
    navigation: ReactNode;
    filterPanel: ReactNode;
    filterDrawerOpen: boolean;
    onFilterDrawerClose: () => void;
    children: ReactNode;
}

const SearchLayout = ({
    isMobile,
    header,
    navigation,
    filterPanel,
    filterDrawerOpen,
    onFilterDrawerClose,
    children,
}: SearchLayoutProps) => {
    const t = useTranslations(TRANSLATION_PATH);
    const theme = useTheme();
    const [filterSidebarOpen, setFilterSidebarOpen] = useState(true);

    const closeFilterDrawer = (event: KeyboardEvent | MouseEvent) => {
        if (
            event.type === "keydown" &&
            ((event as KeyboardEvent).key === "Tab" ||
                (event as KeyboardEvent).key === "Shift")
        ) {
            return;
        }

        onFilterDrawerClose();
    };

    return (
        <>
            {isMobile && (
                <Drawer
                    anchor="top"
                    open={filterDrawerOpen}
                    onClose={closeFilterDrawer}>
                    <Box sx={mobileDrawerContent}>
                        <IconButton
                            data-testid="dialog-close-icon"
                            aria-label="close"
                            onClick={closeFilterDrawer}
                            sx={mobileDrawerClose}>
                            <CloseIcon />
                        </IconButton>
                        {filterPanel}
                    </Box>
                </Drawer>
            )}

            <Box sx={layoutRoot}>
                {header}
                {navigation}
                <Box sx={layoutBody}>
                    {!isMobile && (
                        <>
                            <IconButton
                                size="large"
                                edge="start"
                                aria-label={
                                    filterSidebarOpen
                                        ? t("components.Search.hideFilters")
                                        : t("components.Search.showFilters")
                                }
                                aria-expanded={filterSidebarOpen}
                                onClick={() =>
                                    setFilterSidebarOpen(!filterSidebarOpen)
                                }
                                sx={filterSidebarToggle(
                                    theme,
                                    filterSidebarOpen
                                )}
                                color="secondary">
                                <PanelExpandIcon
                                    sx={filterSidebarToggleIcon(
                                        filterSidebarOpen
                                    )}
                                />
                            </IconButton>

                            <Drawer
                                sx={filterSidebar}
                                variant="persistent"
                                anchor="left"
                                PaperProps={{ sx: filterSidebarPaper }}
                                open={filterSidebarOpen}>
                                <Box sx={filterSidebarContent}>
                                    {filterPanel}
                                </Box>
                            </Drawer>
                        </>
                    )}

                    <Box
                        component="section"
                        sx={mainContent(theme, filterSidebarOpen, isMobile)}>
                        {children}
                    </Box>
                </Box>
            </Box>
        </>
    );
};

export default SearchLayout;
