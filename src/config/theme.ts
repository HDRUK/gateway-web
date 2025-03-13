"use client";

import { ReactElement } from "react";
import { createTheme, styled } from "@mui/material/styles";
import Image from "next/image";
import { sourceSans3 } from "./fonts";

const buttonLinkStyle = {
    padding: 0,
    "&:hover": {
        textDecoration: "underline",
        backgroundColor: "transparent",
    },
};

export const AspectRatioImage = styled(Image)(() => ({
    width: "auto",
    maxHeight: "20vw",
    maxWidth: "30vw",
    height: "100%",
}));

export const DISABLED_OPACITY = 0.4;

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

export type buttonColourType =
    | "inherit"
    | "primary"
    | "secondary"
    | "success"
    | "error"
    | "info"
    | "warning"
    | "yellowCustom"
    | "greyCustom";

declare module "@mui/material/Button" {
    interface ButtonPropsVariantOverrides {
        link: true;
    }
}
declare module "@mui/material/styles" {
    interface Palette {
        warningCustom: Palette["primary"];
        greyCustom: Palette["primary"];
        yellowCustom: Palette["primary"];
    }

    interface PaletteOptions {
        warningCustom?: PaletteOptions["primary"];
        greyCustom?: PaletteOptions["primary"];
        yellowCustom?: PaletteOptions["primary"];
    }
}

declare module "@mui/material/Button" {
    interface ButtonPropsColorOverrides {
        greyCustom: true;
        yellowCustom: true;
    }
}
declare module "@mui/material/Switch" {
    interface SwitchPropsSizeOverrides {
        large: true;
    }
}
declare module "@mui/material/Chip" {
    interface ChipPropsColorOverrides {
        warningCustom: true;
    }
}

declare module "@mui/material/SvgIcon" {
    interface SvgIconPropsSizeOverrides {
        xsmall: true;
    }
}

declare module "@mui/material/Checkbox" {
    interface CheckboxPropsSizeOverrides {
        large: true;
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
    black: "#000",
    orange: "#FE9A2D",
    orange300: "#F9B475",
    orange200: "#F0BB24",
    green50: "#E2F3F0",
    green100: "#B8E2D8",
    green400: "#3DB28C",
    green700: "#2c8267",
    amber500: "#ffc107",
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
    purple400: "#6275B3",
    purple500: "#475da7",
    purple700: "#384B91",
    purple900: "#29235C",
    darkGreen50: "#DEF0F0",
    darkGreen100: "#ADDAD9",
    yellow400: "#F4E751",
};

const palette = {
    primary: {
        main: colors.purple500,
    },
    secondary: {
        main: colors.green400,
    },
    error: {
        main: colors.red700,
    },
    success: {
        main: colors.green700,
    },
    greyCustom: {
        main: colors.grey400,
        light: colors.grey300,
        dark: "#A29415",
        contrastText: colors.grey800,
    },
    yellowCustom: {
        main: colors.yellow400,
        light: "#E9DB5D",
        dark: "#A29415",
        contrastText: colors.grey800,
    },
    background: { default: colors.grey },
    warningCustom: {
        main: colors.amber500,
        light: "#E9DB5D",
        dark: "#A29415",
        contrastText: colors.black,
    },
};

const theme = createTheme({
    typography: {
        fontFamily: sourceSans3.style.fontFamily,
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
                    const ownerStateProps = (
                        ownerState?.children as ReactElement
                    )?.props;

                    return {
                        "&.MuiMenuItem-root:hover": {
                            ...(ownerStateProps?.invertListItem && {
                                background: _theme.palette.primary.dark,
                            }),
                        },
                        "&.MuiMenuItem-root.Mui-selected": {
                            ...(ownerStateProps?.invertListItem && {
                                background: _theme.palette.primary.dark,
                            }),
                        },
                        "&.MuiMenuItem-root.Mui-selected:hover": {
                            ...(ownerStateProps?.invertListItem && {
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
        MuiToggleButton: {
            styleOverrides: {
                root: {
                    background: colors.grey200,

                    "&.Mui-selected": {
                        background: "white",
                    },
                    borderRadius: 0,
                    border: "none",
                },
            },
        },
        MuiAppBar: {
            styleOverrides: {
                root: {
                    boxShadow: "none",
                },
            },
        },
        MuiButton: {
            variants: [
                {
                    props: { color: "greyCustom" },
                    style: {
                        color: colors.grey800,
                        borderColor: palette.greyCustom.light,
                        background: palette.greyCustom.light,
                        "&:active": {
                            background: palette.greyCustom.main,
                        },
                        "&:hover": {
                            background: palette.greyCustom.main,
                        },
                    },
                },
                {
                    props: { color: "yellowCustom" },
                    style: {
                        color: colors.grey800,
                        borderColor: palette.greyCustom.main,
                        "&:active": {
                            background: palette.yellowCustom.main,
                        },
                        "&:hover": {
                            background: palette.yellowCustom.main,
                        },
                    },
                },
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
            variants: [
                {
                    props: { size: "large" },
                    style: {
                        "&.MuiSvgIcon-root": {
                            fontSize: 24,
                        },
                    },
                },
            ],
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
                    width: "100%",
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
                        ":before": {
                            opacity: 1,
                        },
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
                content: ({ theme: _theme }) => {
                    return {
                        "&.Mui-expanded": {
                            margin: `${_theme.spacing(1.5)} 0`,
                        },
                    };
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
                    boxShadow: "none",
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
                h1: ({ theme: _theme }) => ({
                    fontSize: "2rem",
                    fontWeight: 600,
                    marginBottom: _theme.spacing(2),
                }),
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
                caption: {
                    fontSize: "0.75rem",
                },
            },
        },
        MuiSwitch: {
            variants: [
                {
                    props: { size: "small" },
                    style: {
                        width: 36,
                        height: 18,
                        "& .MuiSwitch-switchBase": {
                            transitionDuration: "300ms",

                            "&.Mui-checked": {
                                transform: "translateX(18px)",
                            },
                        },
                        "& .MuiSwitch-thumb": {
                            width: 14,
                            height: 14,
                        },
                        "& .MuiSwitch-track": {
                            borderRadius: 18 / 2,
                        },
                    },
                },
                {
                    props: { size: "medium" },
                    style: {
                        width: 42,
                        height: 22,
                        "& .MuiSwitch-switchBase": {
                            transitionDuration: "300ms",

                            "&.Mui-checked": {
                                transform: "translateX(20px)",
                            },
                        },
                        "& .MuiSwitch-thumb": {
                            width: 18,
                            height: 18,
                        },
                        "& .MuiSwitch-track": {
                            borderRadius: 22 / 2,
                        },
                    },
                },
                {
                    props: { size: "large" },
                    style: {
                        width: 76,
                        height: 26,
                        padding: 0,

                        "& .MuiSwitch-switchBase": {
                            transitionDuration: "300ms",

                            "&.Mui-checked": {
                                transform: "translateX(50px)",
                            },
                        },
                        "& .MuiSwitch-thumb": {
                            width: 22,
                            height: 22,
                        },
                        "& .MuiSwitch-track": {
                            borderRadius: 26 / 2,
                        },
                    },
                },
            ],
            styleOverrides: {
                root: {
                    padding: 0,

                    "& .MuiSwitch-switchBase": {
                        padding: 0,
                        margin: 2,
                        transitionDuration: "400ms",

                        "& .MuiSwitch-input": {
                            left: "0%",
                            width: "330%",
                        },
                        "&.Mui-checked": {
                            "& .MuiSwitch-input": {
                                left: "-220%",
                            },
                            color: colors.white,
                            "& + .MuiSwitch-track": {
                                backgroundColor: palette.secondary.main,
                                opacity: 1,
                                border: 0,
                            },
                            "&.Mui-disabled + .MuiSwitch-track": {
                                opacity: 0.5,
                            },
                        },
                        "&.Mui-disabled+.MuiSwitch-track": {
                            backgroundColor: colors.grey600,
                        },
                    },
                    "& .MuiSwitch-thumb": {
                        boxSizing: "border-box",
                    },
                    "& .MuiSwitch-track": {
                        backgroundColor: palette.error.main,
                        opacity: 1,
                    },
                },
            },
        },
        MuiChip: {
            variants: [
                {
                    props: { color: "warningCustom" },
                    style: {
                        background: colors.orange300,
                    },
                },
            ],
        },
    },
});

export default theme;
