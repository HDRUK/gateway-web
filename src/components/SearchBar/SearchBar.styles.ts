import { styled } from "@mui/material";
import Box from "@/components/Box";
import Form from "@/components/Form";
import Link from "@/components/Link";
import TextField from "@/components/TextField";
import Typography from "@/components/Typography";
import { colors } from "@/config/theme";

export const FormWrapper = styled(Box)(() => ({
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    minHeight: "135px",
    maxWidth: "1000px",
    width: "100%",
}));

export const SearchForm = styled(Form)(({ theme }) => ({
    display: "flex",
    alignItems: "center",
    gap: theme.spacing(1),

    [theme.breakpoints.up("tablet")]: {
        gap: theme.spacing(6),
    },
}));

export const InputWrapper = styled(Box)(() => ({
    width: "100%",
    padding: 0,
    "& div": { margin: 0 },
}));

export const SearchInput = styled(TextField)(({ theme }) => ({
    fontSize: "1.5rem",
    marginBottom: 0,
    "& fieldset": { border: "none" },
    "& input": { padding: 0 },

    [theme.breakpoints.up("tablet")]: {
        fontSize: "2rem",
    },
}));

export const ExplainerText = styled(Typography)(({ theme }) => ({
    color: colors.grey600,
    fontSize: "1rem",
    marginLeft: "57px",

    [theme.breakpoints.up("tablet")]: {
        marginLeft: "97px",
    },
}));

export const ExplainerLink = styled(Link)(({ theme }) => ({
    display: "inline-block",

    [theme.breakpoints.up("tablet")]: {
        marginLeft: theme.spacing(1),
    },
}));
