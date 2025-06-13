import { ListItemText, styled } from "@mui/material";
import EllipsisLineLimit from "@/components/EllipsisLineLimit";
import Link from "@/components/Link";
import Typography from "@/components/Typography";
import { colors } from "@/config/colors";

export const PublicationTitleWrapper = styled("div")(({ theme }) => ({
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: theme.spacing(1),
}));

export const PublicationTitle = styled(Link)(() => ({
    width: "100%",
    fontWeight: 600,
    fontSize: 16,
    display: "flex",
}));

export const PublicationYear = styled(Typography)(({ theme }) => ({
    color: colors.grey600,
    flexShrink: 0,
    marginLeft: theme.spacing(2),
}));

export const PublicationText = styled(Typography)(({ theme }) => ({
    color: colors.grey800,
    fontWeight: 400,
    marginBottom: theme.spacing(2),
}));

export const PublicationAbstract = styled(EllipsisLineLimit)(({ theme }) => ({
    margin: `${theme.spacing(2)} 0 ${theme.spacing(1.5)}`,
    color: colors.grey800,
}));

export const PublicationWrapper = styled(ListItemText)(({ theme }) => ({
    display: "flex",
    gap: theme.spacing(1),
    flexDirection: "column",
}));
