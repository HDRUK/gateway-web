import { styled } from "@mui/material";
import Box from "@/components/Box";
import Form from "@/components/Form";
import Link from "@/components/Link";
import Typography from "@/components/Typography";
import { colors } from "@/config/theme";
import TextFieldBase from "../TextFieldBase";

export const FormWrapper = styled(Box)(() => ({
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    // minHeight: "135px",
    maxWidth: "768px",
    width: "100%",
    padding: 0,
    paddingBottom: 5,
    paddingTop: 0,
}));

export const SearchForm = styled(Form)(({ theme }) => ({
    display: "flex",
    alignItems: "center",
    gap: theme.spacing(1),
    marginTop: 8,
    marginBottom: 18,

    [theme.breakpoints.up("tablet")]: {
        gap: theme.spacing(6),
    },
}));

export const InputWrapper = styled(Box)(() => ({
    width: "100%",
    padding: 0,
    "& div": { margin: 0 },
}));

export const SearchInput = styled(TextFieldBase)(() => ({
    fontSize: "1.25rem",
    marginBottom: 0,
    paddingBottom: 8,
    paddingTop: 8,
    backgroundColor: "white",

    "& fieldset": { border: "none" },
    "& input": { padding: 0 },
}));

export const ExplainerText = styled(Typography)(() => ({
    color: colors.grey100,
    fontSize: "1rem",
}));

export const ExplainerLink = styled(Link)(() => ({
    display: "inline-block",
    color: colors.grey100,
    fontSize: "1rem",
}));
