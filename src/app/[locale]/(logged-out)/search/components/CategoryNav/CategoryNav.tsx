"use client";

import { MouseEvent, useState } from "react";
import { Button } from "@hdruk/ui";
import { Box, Menu, MenuItem, useMediaQuery } from "@mui/material";
import { useTranslations } from "next-intl";
import { usePathname, useRouter } from "next/navigation";
import { SearchCategory } from "@/interfaces/Search";
import Tabs from "@/components/Tabs";
import { TabVariant } from "@/components/Tabs/Tabs";
import { QUERY_FIELD, TYPE_FIELD } from "@/config/forms/search";
import { ChevronThinIcon } from "@/consts/icons";
import { SEARCH_CATEGORY_TABS } from "../../constants";
import { getCategoryHref } from "../../utils/queryParams";
import {
    mobileNav,
    mobileNavButton,
    mobileNavItem,
    navRoot,
    tabBox,
    tabRoot,
} from "./CategoryNav.styles";

const TRANSLATION_PATH = "pages.search";

interface CategoryNavProps {
    type: SearchCategory;
    query?: string;
    isMobile: boolean;
}

const CategoryNav = ({ type, query, isMobile }: CategoryNavProps) => {
    const t = useTranslations(TRANSLATION_PATH);
    const router = useRouter();
    const pathname = usePathname();
    const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);

    // This is a bit hacky because this is the exact width of the tabs with content,
    // so it's susceptible to changes in font size or content.
    // This is required because there's a documented feature (i.e. bug) in MUI Tabs
    // that they can't simultaneously support centering AND scroll bars, so we have
    // to do it ourselves.
    const scrollableTabs = useMediaQuery("(max-width:1372px)");

    const categoryTabs = SEARCH_CATEGORY_TABS.map(({ value, labelKey }) => ({
        label: t(labelKey),
        value,
        tooltip: t(`${labelKey}Tooltip`),
    }));

    const currentLabel = categoryTabs.find(tab => tab.value === type)?.label;

    const handleClose = () => {
        setAnchorEl(null);
    };

    return (
        <Box sx={navRoot}>
            {!isMobile && (
                <Tabs
                    tabs={categoryTabs}
                    tabBoxSx={tabBox(scrollableTabs)}
                    rootBoxSx={tabRoot}
                    variant={TabVariant.SEARCH}
                    paramName={TYPE_FIELD}
                    persistParams={false}
                    persistParamKeys={[QUERY_FIELD]}
                    tabVariant={scrollableTabs ? "scrollable" : "standard"}
                    scrollButtons="on"
                    centered={!scrollableTabs}
                />
            )}
            {isMobile && (
                <Box sx={mobileNav}>
                    <Button
                        aria-controls="tab-menu"
                        aria-haspopup="true"
                        onClick={(event: MouseEvent<HTMLElement>) =>
                            setAnchorEl(event.currentTarget)
                        }
                        aria-label="Open to show search type options"
                        title="Open to show search type options"
                        color="secondary"
                        sx={mobileNavButton}
                        endIcon={<ChevronThinIcon />}>
                        {currentLabel}
                    </Button>
                    <Menu
                        id="tab-menu"
                        anchorEl={anchorEl}
                        keepMounted
                        open={Boolean(anchorEl)}
                        onClose={handleClose}>
                        {categoryTabs.map(item => (
                            <MenuItem
                                onClick={() => {
                                    router.push(
                                        getCategoryHref(
                                            pathname,
                                            item.value,
                                            query
                                        ),
                                        { scroll: false }
                                    );
                                    handleClose();
                                }}
                                key={item.label}
                                value={item.value}
                                sx={mobileNavItem}>
                                {item.label}
                            </MenuItem>
                        ))}
                    </Menu>
                </Box>
            )}
        </Box>
    );
};

export default CategoryNav;
