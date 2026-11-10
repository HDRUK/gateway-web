"use client";

import { MouseEvent, useState } from "react";
import { Button } from "@hdruk/ui";
import { Box, Menu, MenuItem } from "@mui/material";
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
}

const CategoryNav = ({ type, query }: CategoryNavProps) => {
    const t = useTranslations(TRANSLATION_PATH);
    const router = useRouter();
    const pathname = usePathname();
    const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);

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
            <Tabs
                tabs={categoryTabs}
                tabBoxSx={tabBox}
                rootBoxSx={tabRoot}
                variant={TabVariant.SEARCH}
                paramName={TYPE_FIELD}
                persistParams={[QUERY_FIELD]}
                tabVariant="scrollable"
            />
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
        </Box>
    );
};

export default CategoryNav;
