import { styled } from "@mui/material";
import EllipsisLineLimit from "@/components/EllipsisLineLimit";
import { colors } from "@/config/theme";

export const ToolDescription = styled(EllipsisLineLimit)(({ theme }) => ({
    margin: `${theme.spacing(2)} 0 ${theme.spacing(1.5)}`,
    color: colors.grey800,
}));
