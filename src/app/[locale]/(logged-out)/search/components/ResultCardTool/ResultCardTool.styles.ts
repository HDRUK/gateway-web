import { ListItemText, styled } from "@mui/material";
import EllipsisLineLimit from "@/components/EllipsisLineLimit";
import { colors } from "@/config/theme";

export const ToolTitleWrapper = styled("div")(({ theme }) => ({
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: theme.spacing(1),
}));

export const ToolTitle = styled("div")(({ theme }) => ({
    width: "100%",
    color: theme.palette.primary.main,
    fontWeight: 500,
}));

export const ToolDescription = styled(EllipsisLineLimit)(({ theme }) => ({
    margin: `${theme.spacing(2)} 0 ${theme.spacing(1.5)}`,
    color: colors.grey800,
}));

export const ToolWrapper = styled(ListItemText)(({ theme }) => ({
    display: "flex",
    gap: theme.spacing(1),
    flexDirection: "column",
}));
