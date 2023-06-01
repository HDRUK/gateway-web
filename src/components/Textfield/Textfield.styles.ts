import { css } from "@emotion/react";

export const formControl = theme =>
    css({
        "*:nth-child(2)": {
            marginTop: theme.spacing(3),
        },
    });

export const input = theme =>
    css({
        "& .MuiInputBase-input": {
            borderRadius: 4,
            position: "relative",
            backgroundColor:
                theme.palette.mode === "light" ? "#F3F6F9" : "#1A2027",
            border: "1px solid",
            borderColor: theme.palette.mode === "light" ? "#E0E3E7" : "#2D3843",
            fontSize: 16,
            width: "auto",
            padding: "10px 12px",
            transition: theme.transitions.create([
                "border-color",
                "background-color",
                "box-shadow",
            ]),
            // Use the system font instead of the default Roboto font.
            fontFamily: [
                "-apple-system",
                "BlinkMacSystemFont",
                '"Segoe UI"',
                "Roboto",
                '"Helvetica Neue"',
                "Arial",
                "sans-serif",
                '"Apple Color Emoji"',
                '"Segoe UI Emoji"',
                '"Segoe UI Symbol"',
            ].join(","),
            "&:focus": {
                borderColor: theme.palette.primary.main,
            },
        },
    });
