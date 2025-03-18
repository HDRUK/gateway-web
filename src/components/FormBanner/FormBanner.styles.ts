import { styled } from "@mui/material";
import theme, { colors } from "@/config/theme";
import Box from "../Box";

export enum Justify {
    START = "start",
    END = "end",
}

interface ColumnProps {
    emphasis?: boolean;
    justify?: Justify;
}

export const Wrapper = styled("div")(() => ({
    position: "sticky",
    top: 0,
    zIndex: 5,
}));

export const DetailBanner = styled(Box)(() => ({
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    gap: 4,
    backgroundColor: colors.purple900,
    color: colors.white,
    padding: `${theme.spacing(1)} ${theme.spacing(2)}`,
    [theme.breakpoints.up("laptop")]: {
        flexDirection: "row",
    },
}));

export const Column = styled("div")<ColumnProps>(({ emphasis, justify }) => ({
    display: "flex",
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: emphasis ? theme.spacing(0.5) : "initial",
    "> p": { fontWeight: emphasis ? 600 : "inherit" },
    "> .MuiButton-text, .MuiButton-link": { color: colors.white },
    [theme.breakpoints.up("laptop")]: {
        justifyContent: justify || "center",
    },
}));
