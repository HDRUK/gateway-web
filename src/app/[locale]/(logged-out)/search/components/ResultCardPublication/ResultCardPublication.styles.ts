import { ListItemText, styled } from "@mui/material";
import Link from "next/link";
import EllipsisLineLimit from "@/components/EllipsisLineLimit";
import Typography from "@/components/Typography";
import { colors } from "@/config/theme";

export const PublicationTitleWrapper = styled("div")(({ theme }) => ({
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: theme.spacing(1),
}));

export const PublicationTitle = styled(Link)(({ theme }) => ({
    width: "100%",
    color: "#475da7",
    fontWeight: 600,
    fontSize: 16,
    display: "flex",
    marginBottom: 2,
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
