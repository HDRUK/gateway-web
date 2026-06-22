"use client";

import { useCallback, useLayoutEffect, useRef, useState } from "react";
import {
    Checkbox,
    IconButton,
    ListItemText,
    MenuItem,
    Select,
} from "@mui/material";
import { useTranslations } from "next-intl";
import { DashboardEntity, DashboardEntityCount } from "@/interfaces/Dashboard";
import Box from "@/components/Box";
import Typography from "@/components/Typography";
import { colors } from "@/config/theme";
import { ArrowBackIosNewIcon, ArrowForwardIosIcon } from "@/consts/icons";
import ResourceCard from "./ResourceCard";
import { CardsTrack, CardsWrapper } from "./ResourceCounts.styles";

const TRANSLATION_PATH = "pages.account.dashboard.resources";

export interface DashboardResource {
    key: string;
    entity: DashboardEntity | null;
}

export const RESOURCES: DashboardResource[] = [
    { key: "datasets", entity: "datasets" },
    { key: "datauses", entity: "datauses" },
    { key: "tools", entity: "tools" },
    { key: "publications", entity: "publications" },
    { key: "collections", entity: "collections" },
    { key: "generalEnquiries", entity: "general-enquires" },
    { key: "feasibilityEnquiries", entity: "fesability-enquires" },
    { key: "dataAccessRequests", entity: "data-access-requests" },
];

const DEFAULT_SELECTED = [
    "datasets",
    "datauses",
    "tools",
    "publications",
    "collections",
];

interface ResourceCountsProps {
    teamId: string;
    startDate?: string;
    endDate?: string;
    initialCounts: Partial<Record<DashboardEntity, DashboardEntityCount>>;
}

const ResourceCounts = ({
    teamId,
    startDate,
    endDate,
    initialCounts,
}: ResourceCountsProps) => {
    const t = useTranslations(TRANSLATION_PATH);
    const [selected, setSelected] = useState<string[]>(DEFAULT_SELECTED);
    const trackRef = useRef<HTMLUListElement>(null);
    const [canScroll, setCanScroll] = useState({ left: false, right: false });

    const visibleResources = RESOURCES.filter(({ key }) =>
        selected.includes(key)
    );

    const updateScrollState = useCallback(() => {
        const track = trackRef.current;
        if (!track) return;
        setCanScroll({
            left: track.scrollLeft > 0,
            right: track.scrollLeft < track.scrollWidth - track.clientWidth - 1,
        });
    }, []);

    useLayoutEffect(() => {
        const track = trackRef.current;
        if (!track) return;

        updateScrollState();

        const observer = new ResizeObserver(updateScrollState);
        observer.observe(track);
        return () => observer.disconnect();
    }, [updateScrollState, selected]);

    const handleArrowClick = (direction: 1 | -1) => {
        const track = trackRef.current;
        const card = track?.querySelector("li");
        if (!track || !card) return;

        const gap = parseFloat(getComputedStyle(track).columnGap) || 0;
        track.scrollBy({
            left: direction * (card.offsetWidth + gap),
            behavior: "smooth",
        });
    };

    return (
        <Box>
            <Box
                sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    flexWrap: "wrap",
                    gap: 2,
                    p: 0,
                    mb: 2,
                }}>
                <Typography variant="h2" sx={{ mb: 0 }}>
                    {t("title")}
                </Typography>
                <Select
                    multiple
                    size="small"
                    displayEmpty
                    value={selected}
                    onChange={e => setSelected(e.target.value as string[])}
                    renderValue={() => t("chooseResources")}
                    inputProps={{ "aria-label": t("chooseResources") }}
                    sx={{ minWidth: 200 }}>
                    {RESOURCES.map(({ key }) => (
                        <MenuItem key={key} value={key}>
                            <Checkbox
                                checked={selected.includes(key)}
                                disableRipple
                            />
                            <ListItemText primary={t(`labels.${key}`)} />
                        </MenuItem>
                    ))}
                </Select>
            </Box>
            <CardsWrapper>
                {canScroll.left && (
                    <IconButton
                        aria-label={t("scrollLeft")}
                        onClick={() => handleArrowClick(-1)}
                        sx={{
                            position: "absolute",
                            left: 0,
                            top: "50%",
                            transform: "translate(-50%, -50%)",
                            zIndex: 1,
                            bgcolor: colors.white,
                            boxShadow: 2,
                            "&:hover": { bgcolor: colors.white },
                        }}>
                        <ArrowBackIosNewIcon fontSize="small" />
                    </IconButton>
                )}
                <CardsTrack
                    ref={trackRef}
                    onScroll={updateScrollState}
                    tabIndex={0}
                    aria-label={t("title")}>
                    {visibleResources.map(({ key, entity }) => (
                        <ResourceCard
                            key={key}
                            teamId={teamId}
                            label={t(`labels.${key}`)}
                            entity={entity}
                            startDate={startDate}
                            endDate={endDate}
                            fallbackData={
                                entity ? initialCounts[entity] : undefined
                            }
                        />
                    ))}
                </CardsTrack>
                {canScroll.right && (
                    <IconButton
                        aria-label={t("scrollRight")}
                        onClick={() => handleArrowClick(1)}
                        sx={{
                            position: "absolute",
                            right: 0,
                            top: "50%",
                            transform: "translate(50%, -50%)",
                            zIndex: 1,
                            bgcolor: colors.white,
                            boxShadow: 2,
                            "&:hover": { bgcolor: colors.white },
                        }}>
                        <ArrowForwardIosIcon fontSize="small" />
                    </IconButton>
                )}
            </CardsWrapper>
        </Box>
    );
};

export default ResourceCounts;
