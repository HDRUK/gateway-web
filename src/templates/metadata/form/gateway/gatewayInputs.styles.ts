import { tokens } from "@hdruk/ui/theme";
import { styled } from "@mui/material/styles";
import { AddIcon } from "@/consts/icons";

export const ThemeOption = styled("div")(({ theme }) => ({
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    gap: theme.spacing(2),
}));

export const VariantRow = styled("div")(({ theme }) => ({
    marginBottom: theme.spacing(3),
}));

export const ArrayItem = styled("div")(({ theme }) => ({
    marginBottom: theme.spacing(3),
}));

export const ArrayLabel = styled("p")(({ theme }) => ({
    ...theme.typography.body1,
    margin: 0,
    marginBottom: theme.spacing(1),
}));

export const ArrayError = styled("p")(({ theme }) => ({
    ...theme.typography.body1,
    margin: 0,
    color: tokens.status.error,
}));

export const RequiredMark = styled("span")({
    color: tokens.status.error,
});

export const AddButtonRow = styled("div")(({ theme }) => ({
    marginBottom: theme.spacing(3),
}));

export const AddIconSmall = styled(AddIcon)({
    height: 14,
    width: 14,
});

export const GroupItem = styled("div")(({ theme }) => ({
    marginBottom: theme.spacing(1),
}));
