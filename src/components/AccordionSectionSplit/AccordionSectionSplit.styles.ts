import { ElementType } from "react";
import { styled, Typography } from "@mui/material";
import AccordionCard from "@/components/AccordionSection/AccordionCard";

const GAP = 2;
const MOBILE_VISIBLE_ROWS = 2;

export const SplitWrapper = styled("div")<{ columnCount: number }>(
    ({ theme, columnCount }) => ({
        display: "grid",
        gridTemplateColumns: "1fr",
        gap: theme.spacing(GAP),
        alignItems: "stretch",
        ...(columnCount > 1 && {
            [theme.breakpoints.up("sm")]: {
                gridTemplateColumns: "1fr 1fr",
            },
        }),
    })
);

export const Pane = styled("div")(({ theme }) => ({
    display: "flex",
    flexDirection: "column",
    gap: theme.spacing(1),
    minWidth: 0,
}));

export const PaneHeading = styled("div")(({ theme }) => ({
    display: "flex",
    alignItems: "baseline",
    gap: theme.spacing(1),
    minWidth: 0,
}));

export const PaneTitle = styled(Typography)<{ component?: ElementType }>({
    minWidth: 0,
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
});

export const PaneCount = styled(Typography)({
    flexShrink: 0,
});

export const SplitCard = styled(AccordionCard)(({ theme }) => ({
    height: "100%",
    overflow: "hidden",
    "& .MuiCardContent-root": {
        height: "100%",
        gap: theme.spacing(1),
    },
    "& .MuiCardContent-root > *": {
        whiteSpace: "nowrap",
        overflow: "hidden",
        textOverflow: "ellipsis",
        flexShrink: 0,
    },
}));

export const ScrollArea = styled("div", {
    shouldForwardProp: prop =>
        prop !== "cardHeight" &&
        prop !== "visibleRows" &&
        prop !== "mediaCards",
})<{ cardHeight: number; visibleRows: number; mediaCards?: boolean }>(
    ({ theme, cardHeight, visibleRows, mediaCards }) => ({
        display: "grid",
        gridTemplateColumns: "1fr",
        gridAutoRows: `${cardHeight}px`,
        gap: theme.spacing(GAP),
        overflowY: "auto",
        flexGrow: 1,
        maxHeight: `calc(${
            cardHeight * MOBILE_VISIBLE_ROWS
        }px + ${theme.spacing(GAP * (MOBILE_VISIBLE_ROWS - 1))})`,
        [theme.breakpoints.up("md")]: {
            maxHeight: `calc(${cardHeight * visibleRows}px + ${theme.spacing(
                GAP * (visibleRows - 1)
            )})`,
            ...(mediaCards && { gridTemplateColumns: "repeat(2, 1fr)" }),
        },
        [theme.breakpoints.up("xl")]: {
            gridTemplateColumns: mediaCards
                ? "repeat(4, 1fr)"
                : "repeat(2, 1fr)",
        },
    })
);
