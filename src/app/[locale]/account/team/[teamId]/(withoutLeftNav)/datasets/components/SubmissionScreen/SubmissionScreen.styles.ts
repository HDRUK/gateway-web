import { styled } from "@mui/material/styles";

export const ErrorList = styled("ul")(({ theme }) => ({
    margin: 0,
    padding: theme.spacing(0.5, 0, 0.5, 2.5),
}));

export const ErrorItem = styled("li")(({ theme }) => ({
    "&:not(:last-of-type)": {
        marginBottom: theme.spacing(0.5),
    },
}));
