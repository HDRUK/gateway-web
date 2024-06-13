import { styled } from "@mui/material";

export const Content = styled("div")(({ theme }) => ({
    h5: {
        fontSize: 18,
    },
    a: {
        color: theme.palette.secondary.main,
        ":hover": {
            textDecoration: "none",
        },
    },
}));
