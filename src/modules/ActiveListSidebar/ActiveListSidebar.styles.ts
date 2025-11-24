import { styled } from "@mui/material";
import Box from "@/components/Box";
import Typography from "@/components/Typography";
import theme from "@/config/theme";

export const Wrapper = styled(Box)(() => ({
    position: "sticky",
    top: 0,
    padding: 0,
    zIndex: theme.zIndex.appBar,
    backgroundColor: theme.palette.common.white,
}));

export const BookmarkText = styled(Typography)(({ theme }) => ({
    padding: `${theme.spacing(3)} ${theme.spacing(1)}`,
    borderBottom: `1px solid ${theme.palette.greyCustom.main}`,
    margin: `0 ${theme.spacing(2)}`,
}));

export const ActiveLinkWrapper = styled(Box)(({ theme }) => ({
    padding: `0 ${theme.spacing(3)}`,
}));
