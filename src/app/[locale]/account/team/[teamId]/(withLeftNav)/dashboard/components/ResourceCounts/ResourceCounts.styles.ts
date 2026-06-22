import { styled } from "@mui/material";
import { colors } from "@/config/theme";

const CARDS_PER_ROW = 5;
const CARD_MIN_WIDTH = 190;
const TRACK_GAP = 2;

export const CardsWrapper = styled("div")(() => ({
    position: "relative",
}));

export const CardsTrack = styled("ul")(({ theme }) => ({
    display: "flex",
    gap: theme.spacing(TRACK_GAP),
    overflowX: "auto",
    scrollSnapType: "x mandatory",
    listStyle: "none",
    margin: 0,
    padding: 0,
    scrollbarWidth: "none",
    "&::-webkit-scrollbar": {
        display: "none",
    },
}));

export const ResourceCardItem = styled("li")(({ theme }) => ({
    flex: `0 0 calc((100% - ${theme.spacing(
        TRACK_GAP * (CARDS_PER_ROW - 1)
    )}) / ${CARDS_PER_ROW})`,
    minWidth: CARD_MIN_WIDTH,
    scrollSnapAlign: "start",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: theme.spacing(1),
    background: colors.grey100,
    border: `1px solid ${colors.grey300}`,
    borderRadius: theme.shape.borderRadius,
    padding: theme.spacing(3, 2),
    textAlign: "center",
}));
