"use client";

import { useCallback, useState, useEffect } from "react";
import { Menu, MenuItem, Typography, useMediaQuery, useTheme } from "@mui/material";
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
import FilterSection from "@/components/FilterSection";
import { FieldValues, InternalFieldName, FieldArrayPath, FieldArray, FieldErrors, FieldName, ReadFormState, FormState, RegisterOptions, UseFormRegisterReturn, SubmitHandler, SubmitErrorHandler, FieldError, ErrorOption, UseFormSetValue, useForm } from "react-hook-form";
import { FILTER_PUBLISHER_NAME } from "@/config/forms/filters";

const TRANSLATION_PATH = "modules.ActiveListSidebar";
const MOBILE_SCROLL_OFFSET = 60;

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

    const { control, setValue } = useForm<{
        [FILTER_PUBLISHER_NAME]: string;
    }>({
        defaultValues: {
            [FILTER_PUBLISHER_NAME]: "",
        },
    });

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

    const handleScroll = useCallback(
        (id: number) => {
            const section = document.querySelector<HTMLElement>(`#anchor${id}`);
            const heading = section?.querySelector<HTMLElement>("h2");

            if (section) {
                const rect = section.getBoundingClientRect();
                const desiredScroll =
                    window.pageYOffset +
                    rect.top -
                    (isMobile ? MOBILE_SCROLL_OFFSET : 0);

                window.scrollTo({ top: desiredScroll, behavior: "smooth" });

                heading?.focus({ preventScroll: true });
                setActiveItem(id);

                if (!isDatasetPage) {
                    setTimeout(() => setActiveItem(0), 200);
                }
            }
        },
        [isDatasetPage, isMobile]
    );

    return (
        <>
            {!isMobile && (
                <Wrapper
                    sx={{ gridColumn: { tablet: "span 1", laptop: "span 1" } }}>
                    <BookmarkText>{t("bookmarks")}</BookmarkText>
                    <ActiveLinkWrapper>
                        <ActiveList
                            items={items}
                            handleClick={handleScroll}
                            activeItem={activeItem}
                        />
                    </ActiveLinkWrapper>
                    <Box>
                        <FilterSection filterSection="publisherName" filterItem={{
                            label: "",
                            value: "",
                            buckets: []
                        }} 
                        control={control}
                        checkboxValues={{}} 
                        countsDisabled={false} 
                        handleCheckboxChange={function (updates: { [key: string]: boolean; }): void {
                            throw new Error("Function not implemented.");
                        } } 
                        setValue={function (name: string, value: UseFormSetValue<FieldValues>): void {
                            throw new Error("Function not implemented.");
                        } } 
                        resetFilterSection={function (): void {
                            throw new Error("Function not implemented.");
                        } } />
                    </Box>
                </Wrapper>
            )}
            {isMobile && (
                <Wrapper>
                    <Box
                        sx={{
                            width: "100%",
                            p: 0,
                            boxShadow: theme.customShadows.subtle,
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
                                width: "100%",
                                display: "flex",
                                justifyContent: "flex-start",
                                color: theme.palette.text.primary,
                                px: 2,
                                py: 2,
                                "&:hover": {
                                    backgroundColor: theme.palette.grey[100],
                                },
                            }}
                            variant="text"
                            endIcon={<ChevronThinIcon color="primary" />}>
                            {t("bookmarks")}
                        </Button>
                        <Menu
                            id="bookmark-menu"
                            anchorEl={anchorEl}
                            keepMounted
                            open={Boolean(anchorEl)}
                            onClose={handleClose}
                            slotProps={{
                                paper: {
                                    sx: {
                                        left: "0 !important",
                                        m: 0,
                                        width: "100%",
                                        maxWidth: "100%",
                                        "& .MuiMenu-list": {
                                            p: 0,
                                        },
                                    },
                                },
                            }}>
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
                </Wrapper>
            )}
        </>
    );
};

export default ActiveListSidebar;
