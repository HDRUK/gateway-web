import { tokens } from "@hdruk/ui/theme";
import { ListItemText, styled } from "@mui/material";
import EllipsisLineLimit from "@/components/EllipsisLineLimit";
import Link from "@/components/Link";
import Typography from "@/components/Typography";

export const PublicationTitle = styled(Link)(() => ({
    width: "100%",
    fontWeight: 600,
    fontSize: 16,
    display: "flex",
}));

export const PublicationYear = styled(Typography)(({ theme }) => ({
    color: tokens.text.disabled,
    flexShrink: 0,
    marginLeft: theme.spacing(2),
}));

export const PublicationText = styled(Typography)(({ theme }) => ({
    color: tokens.text.secondaryBlack,
    fontWeight: 400,
    marginBottom: theme.spacing(2),
}));

export const PublicationAbstract = styled(EllipsisLineLimit)(({ theme }) => ({
    margin: `${theme.spacing(2)} 0 ${theme.spacing(1.5)}`,
    color: tokens.text.secondaryBlack,
}));

export const PublicationWrapper = styled(ListItemText)(({ theme }) => ({
    display: "flex",
    gap: theme.spacing(1),
    flexDirection: "column",
}));
