import { styled } from "@mui/material";
import Typography from "@/components/Typography";

export const CategoryHeader = styled(Typography)(({ theme }) => ({
    marginBottom: theme.spacing(2),
    marginTop: theme.spacing(2),
    paddingTop: theme.spacing(2),
    borderTop: `1px solid ${theme.palette.grey[300]}`,
}));
