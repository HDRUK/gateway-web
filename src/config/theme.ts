import { createTheme } from "@mui/material/styles";
import { buttonLinkStyle } from "./overrides";

export type colourType =
    | "inherit"
    | "action"
    | "disabled"
    | "primary"
    | "secondary"
    | "error"
    | "info"
    | "success"
    | "warning";

declare module "@mui/material/Button" {
    interface ButtonPropsVariantOverrides {
        link: true;
    }
}

declare module "@mui/material/SvgIcon" {
    interface SvgIconPropsSizeOverrides {
        xsmall: true;
    }
}

declare module "@mui/material/styles" {
    interface BreakpointOverrides {
        xs: false;
        sm: false;
        md: false;
        lg: false;
        xl: false;
        mobile: true;
        tablet: true;
        laptop: true;
        desktop: true;
    }
}

export const colors = {
    white: "#fff",
    orange: "#FE9A2D",
    green400: "#3DB28C",
    grey: "#F6F7F8",
    grey100: "#F6F7F8",
    grey200: "#EEE",
    grey300: "#E2E2E2",
    grey400: "#D0D3D4",
    grey500: "#B3B8BD",
    grey600: "#868E96",
    grey700: "#53575A",
    grey800: "#3C3C3B",
    grey900: "#262626",
    red50: "#FFECF1",
    red600: "#EF3F4B",
    red700: "#DC3645",
    red900: "#C02531",
    purple100: "#C6CEE5",
    purple200: "#A2AED3",
    purple500: "#475da7",
    purple700: "#384B91",
};

const palette = {
    primary: {
        main: "#475DA7",
    },
    secondary: {
        main: colors.green400,
    },
    error: {
        main: colors.red700,
    },
    errorBackground: {
        main: colors.red50,
    },
    errorBorder: {
        main: colors.red700,
    },
    background: { default: "#f6f7f8" },
};

const theme = createTheme({
    typography: {
        fontFamily: ["Arial"].join(","),
        body1: {
            fontSize: 14,
        },
    },
    breakpoints: {
        values: {
            mobile: 0,
            tablet: 640,
            laptop: 1024,
            desktop: 1280,
        },
    },
    palette,
    components: {
        MuiSvgIcon: {
            variants: [
                {
                    props: { fontSize: "xsmall" },
                    style: {
                        fontSize: "0.8rem",
                    },
                },
            ],
        },
        MuiButtonBase: {
            styleOverrides: {
                root: ({ ownerState, theme: _theme }) => {
                    return {
                        "&.MuiMenuItem-root:hover": {
                            ...(ownerState.children?.props?.invertListItem && {
                                background: _theme.palette.primary.dark,
                            }),
                        },
                        "&.MuiMenuItem-root.Mui-selected": {
                            ...(ownerState.children?.props?.invertListItem && {
                                background: _theme.palette.primary.dark,
                            }),
                        },
                        "&.MuiMenuItem-root.Mui-selected:hover": {
                            ...(ownerState.children?.props?.invertListItem && {
                                background: _theme.palette.primary.dark,
                            }),
                        },
                        "&.MuiTab-root": {
                            textTransform: "initial",
                        },
                        "&.MuiTab-root.Mui-selected": {
                            color: colors.grey900,
                        },
                    };
                },
            },
        },
        MuiTabs: {
            styleOverrides: {
                indicator: {
                    height: 3,
                    backgroundColor: palette.secondary.main,
                },
            },
        },
        MuiButton: {
            variants: [
                {
                    props: { variant: "link" },
                    style: {
                        color: palette.primary.main,
                        ...buttonLinkStyle,
                    },
                },
                {
                    props: { variant: "link", color: "secondary" },
                    style: {
                        color: palette.secondary.main,
                        ...buttonLinkStyle,
                    },
                },
            ],
            styleOverrides: {
                root: ({ ownerState, theme: _theme }) => ({
                    "&:hover": {
                        borderWidth: 2,
                    },
                    borderWidth: 2,
                    textTransform: "none",
                    borderColor:
                        ownerState.color === "inherit"
                            ? _theme.palette.primary.main
                            : _theme.palette[ownerState.color || "primary"]
                                  ?.main,
                }),
                outlined: ({ ownerState, theme: _theme }) => {
                    return {
                        color: colors.grey800,
                        borderWidth: 2,
                        "&:hover": {
                            color: colors.white,
                            background:
                                ownerState.color === "inherit"
                                    ? _theme.palette.primary.main
                                    : _theme.palette[
                                          ownerState.color || "primary"
                                      ]?.main,
                        },
                    };
                },
            },
        },
        MuiFormHelperText: {
            styleOverrides: {
                root: {
                    marginLeft: 0,
                    marginTop: 0,
                },
            },
        },
        MuiInputLabel: {
            styleOverrides: {
                root: {
                    paddingLeft: 0,
                },
            },
        },
        MuiInputBase: {
            styleOverrides: {
                root: {
                    marginTop: 3,
                    "& fieldset": {
                        borderWidth: 2,
                    },
                    "&.MuiOutlinedInput-root:hover .MuiOutlinedInput-notchedOutline":
                        {
                            borderColor: colors.green400,
                        },
                    "&.MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline":
                        {
                            borderColor: colors.green400,
                        },
                    "&.MuiOutlinedInput-root.Mui-error .MuiOutlinedInput-notchedOutline":
                        {
                            borderColor: palette.error.main,
                        },
                    "&.MuiOutlinedInput-root.Mui-disabled .MuiOutlinedInput-notchedOutline":
                        {
                            borderColor: colors.grey400,
                        },
                    "&.MuiOutlinedInput-root.Mui-readOnly": {
                        color: colors.grey600,
                        backgroundColor: colors.grey200,
                    },
                    "&.MuiOutlinedInput-root.Mui-readOnly .MuiOutlinedInput-notchedOutline":
                        {
                            borderColor: colors.grey400,
                        },
                    "&.MuiOutlinedInput-root.Mui-readOnly:hover .MuiOutlinedInput-notchedOutline":
                        {
                            borderColor: colors.grey400,
                        },
                },
            },
        },
        MuiCheckbox: {
            styleOverrides: {
                root: {
                    color: colors.grey400,
                    "&.MuiCheckbox-colorError": {
                        color: palette.error.main,
                    },
                },
            },
        },
        MuiFormControlLabel: {
            styleOverrides: {
                root: {
                    fontSize: 14,
                    "&.Mui-error": {
                        color: palette.error.main,
                    },
                },
                label: {
                    fontSize: 14,
                },
                asterisk: {
                    color: palette.error.main,
                },
            },
        },
        MuiMenu: {
            styleOverrides: {
                paper: {
                    borderRadius: 0,
                    boxShadow: "1px 1px 3px 0 rgba(0,0,0,.09)",
                },
            },
        },
        MuiPagination: {
            defaultProps: {
                variant: "outlined",
                shape: "rounded",
            },
        },
        MuiAccordion: {
            styleOverrides: {
                root: {
                    "&.Mui-expanded": {
                        margin: 0,
                    },
                },
            },
        },
        MuiAccordionSummary: {
            styleOverrides: {
                root: {
                    "&.Mui-expanded": {
                        minHeight: "48px",
                    },
                },
                content: {
                    "&.Mui-expanded": {
                        margin: 0,
                    },
                },
            },
        },
        MuiList: {
            styleOverrides: {
                root: {
                    padding: 0,
                },
            },
        },
        MuiPaper: {
            styleOverrides: {
                root: {
                    borderRadius: 0,
                    boxShadow: "1px 1px 3px 0px rgba(0, 0, 0, 0.09)",
                },
            },
        },
        MuiCard: {
            styleOverrides: {
                root: {
                    borderRadius: 0,
                    boxShadow: "1px 1px 3px 0px rgba(0, 0, 0, 0.09)",
                },
            },
        },
        MuiDialogTitle: {
            styleOverrides: {
                root: {
                    fontSize: "1.3rem",
                },
            },
        },
        MuiTypography: {
            styleOverrides: {
                root: {
                    fontSize: "0.875rem",
                },
                h2: {
                    fontSize: "1.3rem",
                    fontWeight: 400,
                    marginBottom: 15,
                },
                h3: {
                    fontSize: "1.1rem",
                    fontWeight: 400,
                    marginBottom: 2,
                },
                h4: {
                    fontSize: "1rem",
                    fontWeight: 400,
                    marginBottom: 2,
                },
            },
        },
        MuiSwitch: {
            styleOverrides: {
                root: {
                    width: 80,
                    height: 24,
                    padding: 0,
                    "& .MuiSwitch-switchBase": {
                        padding: 0,
                        margin: 2,
                        transitionDuration: "300ms",
                        "&.Mui-checked": {
                            transform: "translateX(56px)",
                            color: colors.white,
                            "& + .MuiSwitch-track": {
                                backgroundColor: palette.secondary.main,
                                opacity: 1,
                                border: 0,
                            },
                            "& .MuiSwitch-input": {
                                left: "-290%",
                                width: "400%",
                            },
                            "&.Mui-disabled + .MuiSwitch-track": {
                                opacity: 0.5,
                            },
                        },

                        "& .MuiSwitch-input": {
                            width: "400%",
                            left: "-10%",
                        },
                    },
                    "& .MuiSwitch-thumb": {
                        boxSizing: "border-box",
                        width: 20,
                        height: 20,
                    },
                    "& .MuiSwitch-track": {
                        borderRadius: 26 / 2,
                        backgroundColor: palette.error.main,
                        opacity: 1,
                    },
                },
            },
        },
    },
});

export default theme;
