import { tokens } from "@hdruk/ui/theme";
import { styled } from "@mui/material";
import EllipsisLineLimit from "@/components/EllipsisLineLimit";

export const ToolDescription = styled(EllipsisLineLimit)(({ theme }) => ({
    margin: `${theme.spacing(2)} 0 ${theme.spacing(1.5)}`,
    color: tokens.text.secondaryBlack,
}));
