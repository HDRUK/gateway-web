"use client";

import { useCallback, useState, useEffect } from "react";
import { Menu, MenuItem, useMediaQuery, useTheme } from "@mui/material";
import { toNumber } from "lodash";
import { useTranslations } from "next-intl";
import { usePathname, useSearchParams } from "next/navigation";
import ActiveList from "@/components/ActiveList";
import Box from "@/components/Box";
import Button from "@/components/Button";
import { ChevronThinIcon } from "@/consts/icons";
import {
    ActiveLinkWrapper,
    BookmarkText,
    Wrapper,
} from "./ActiveListSidebar.styles";

const TRANSLATION_PATH = "modules.ActiveListSidebar";

const ActiveListSidebar = ({
    items,
}: {
    items: {
        label: string;
    }[];
}) => {
    const t = useTranslations(TRANSLATION_PATH);

    const [activeItem, setActiveItem] = useState(0);

    const searchParams = useSearchParams();
    const isDatasetPage = usePathname()?.includes("dataset");

    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.only("mobile"));

    const [anchorEl, setAnchorEl] = useState(null);
    const handleClick = e => {
        setAnchorEl(e.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };

    useEffect(() => {
        if (!searchParams) {
            return;
        }

        if (isDatasetPage) {
            const sectionInView = searchParams.get("section");
            if (sectionInView) {
                setActiveItem(toNumber(sectionInView));
            }
        }
    }, [searchParams]);

    const handleScroll = useCallback((id: number) => {
        const section = document.querySelector<HTMLElement>(`#anchor${id}`);
        const heading = section?.querySelector<HTMLElement>("h2");
        if (section) {
            section.scrollIntoView({ behavior: "smooth", block: "start" });
            heading?.focus({ preventScroll: true });
            setActiveItem(id);
            if (!isDatasetPage) {
                setTimeout(() => {
                    setActiveItem(0);
                }, 200);
            }
        }
    }, []);

    return (
        <>
            {!isMobile && (
                <Wrapper>
                    <BookmarkText>{t("bookmarks")}</BookmarkText>
                    <ActiveLinkWrapper>
                        <ActiveList
                            items={items}
                            handleClick={handleScroll}
                            activeItem={activeItem}
                        />
                    </ActiveLinkWrapper>
                </Wrapper>
            )}
            {isMobile && (
                <Box
                    sx={{
                        width: "100%",
                        mt: 1,
                        px: 2,
                        py: 1,
                        boxShadow: "1px 1px 3px 0px rgba(0, 0, 0, 0.09)",
                        borderTop: "1px solid rgba(238, 238, 238, 1)",
                    }}>
                    <Button
                        aria-controls="bookmark-menu"
                        aria-haspopup="true"
                        onClick={handleClick}
                        aria-label="Open to select bookmark"
                        title="Open to select bookmark"
                        color="secondary"
                        sx={{
                            backgroundColor: "white",
                            fontSize: "15px",
                            fontWeight: 600,
                            "&:hover": { background: "white" },
                        }}
                        endIcon={<ChevronThinIcon color="primary" />}>
                        {t("bookmarks")}
                    </Button>
                    <Menu
                        id="bookmark-menu"
                        anchorEl={anchorEl}
                        keepMounted
                        open={Boolean(anchorEl)}
                        onClose={handleClose}>
                        {items.map((item, index) => {
                            return (
                                <MenuItem
                                    onClick={() => {
                                        handleScroll(index + 1);
                                        handleClose();
                                    }}
                                    key={item.label}
                                    value={item.label}
                                    sx={{ fontSize: "15px" }}>
                                    {item.label}
                                </MenuItem>
                            );
                        })}
                    </Menu>
                </Box>
            )}
        </>
    );
};

export default ActiveListSidebar;
