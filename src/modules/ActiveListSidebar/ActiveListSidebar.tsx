"use client";

import { useCallback, useState, useEffect, SetStateAction } from "react";
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
import FilterSection from "@/components/FilterSection";
import { FILTER_PUBLISHER_NAME, filtersList } from "@/config/forms/filters";
import { BucketCheckbox, Filter, FilterItem, FilterValues } from "@/interfaces/Filter";
import { useForm } from "react-hook-form";

const TRANSLATION_PATH = "modules.ActiveListSidebar";
const MOBILE_SCROLL_OFFSET = 60;

const ActiveListSidebar = ({
    items,
    filter,
    filterValues,
    onFilterChange,
    }: {
    items: {
        label: string;
    }[];
    filter?: Filter
    filterValues: FilterValues;
    onFilterChange: (values: FilterValues) => void;
}) => {

    const t = useTranslations(TRANSLATION_PATH);

    const [activeItem, setActiveItem] = useState(0);

    const searchParams = useSearchParams();
    const isDatasetPage = usePathname()?.includes("dataset");

    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.only("mobile"));

    const [anchorEl, setAnchorEl] = useState(null);
    const handleClick = (e: { currentTarget: SetStateAction<null>; }) => {
        setAnchorEl(e.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };

    const [filterItem, setFilterItem] =
        useState<FilterItem>();

    useEffect(() => {
        if (filter) {
            setFilterItem({
                label: filter.keys,
                value: filter.value,
                buckets: filter.buckets.map(bucket => {
                    return {value: bucket.key,
                            label: bucket.key,
                            count: bucket.doc_count,
                    }
                }),
            });
        }
    }, [filter])

    const resetFilterSection = () => {
        onFilterChange({});
    };

    const handleCheckboxChange = (updates: { [key: string]: boolean }) => {
        onFilterChange({ ...filterValues, ...updates });
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
                        {filterItem && (
                            <FilterSection
                                filterSection={FILTER_PUBLISHER_NAME}
                                filterItem={filterItem}
                                checkboxValues={filterValues}
                                resetFilterSection={resetFilterSection}                                
                                control={control}
                                countsDisabled={true}
                                handleCheckboxChange={handleCheckboxChange}
                                setValue={setValue}
                            />)}
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
