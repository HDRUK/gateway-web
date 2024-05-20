import { styled } from "@mui/material";
import Box from "@/components/Box";
import Chip from "@/components/Chip";

export const ToolFieldWrapper = styled(Box)(({ theme }) => ({
    padding: 0,
    gap: theme.spacing(1),
    display: "flex",
    flexWrap: "wrap",
}));

export const ToolFieldItem = styled(Chip)(({ theme }) => ({
    textOverflow: "ellipsis",
    overflow: "hidden",
    whiteSpace: "nowrap",
    height: "auto",
    padding: theme.spacing(0.5),
    borderRadius: theme.spacing(0.5),
}));

export const ListContainer = styled("div")(({ theme }) => ({
    padding: 0,
    display: "flex",
    flexDirection: "column",
    gap: theme.spacing(1),
}));
