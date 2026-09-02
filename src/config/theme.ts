"use client";

import { createHdrukTheme, tokens } from "@hdruk/ui/theme";

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

    interface Theme {
        customShadows: {
            subtle: string;
        };
    }

    interface ThemeOptions {
        customShadows?: {
            subtle?: string;
        };
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
        alias: true;
        greyCustom: true;
        yellowCustom: true;
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

// Values with no @hdruk/ui token. Everything else comes from `tokens`.
export const colors = {
    black: "#000",
    orange300: "#F9B475",
    green400: "#3DB28C",
    amber500: "#ffc107",
    grey400: "#D0D3D4",
    grey500: "#B3B8BD",
    red600: "#EF3F4B",
    purple400: "#6275B3",
    teal700: "#017397",
    darkGreen50: "#DEF0F0",
    darkGreen100: "#ADDAD9",
    yellow400: "#F4E751",
    yellow500: "#FFC40C",
};

const palette = {
    secondary: {
        main: colors.green400,
    },
    // `main` is the resting fill and `dark` the hover: MUI derives every
    // button state from these, so the shades carry the whole colour.
    greyCustom: {
        light: tokens.status.grey,
        main: colors.grey400,
        dark: "#A29415",
        contrastText: tokens.text.secondaryBlack,
    },
    yellowCustom: {
        main: colors.yellow400,
        light: "#E9DB5D",
        dark: "#A29415",
        contrastText: tokens.text.secondaryBlack,
    },
    warningCustom: {
        main: colors.amber500,
        light: "#E9DB5D",
        dark: "#A29415",
        contrastText: colors.black,
    },
    alias: {
        backgroundColor: tokens.status.archived,
        contrastText: tokens.background.white,
    },
};

const subtleShadow = "1px 1px 3px 0 rgba(0,0,0,.09)";

const theme = createHdrukTheme({
    transitions: {
        duration: { enteringScreen: 400, leavingScreen: 400 },
    },
    palette,
    components: {
        MuiTooltip: {
            defaultProps: {
                enterDelay: 1000,
                enterNextDelay: 1000,
            },
        },
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
        MuiMenuItem: {
            styleOverrides: {
                root: ({ theme }) => ({
                    "&:focus": {
                        backgroundColor: tokens.background.white,

                        "&.Mui-focusVisible": {
                            outline: `3px solid ${theme.palette.primary.main}`,
                            outlineOffset: "-3px",
                        },
                    },
                    "&:hover": {
                        backgroundColor: theme.palette.grey[200],
                    },
                }),
            },
        },
        MuiToggleButton: {
            styleOverrides: {
                root: {
                    background: tokens.status.hovered,

                    "&.Mui-selected": {
                        background: tokens.background.white,
                    },
                    border: "none",
                },
            },
        },
        MuiTabs: {
            styleOverrides: {
                indicator: {
                    height: 3,
                    borderRadius: 3,
                    backgroundColor: palette.secondary.main,
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
                    "&.MuiOutlinedInput-root.Mui-error .MuiOutlinedInput-notchedOutline":
                        {
                            borderColor: tokens.status.error,
                        },
                    "&.MuiOutlinedInput-root.Mui-disabled .MuiOutlinedInput-notchedOutline":
                        {
                            borderColor: colors.grey400,
                        },
                    "&.MuiOutlinedInput-root.Mui-readOnly": {
                        color: tokens.status.faded,
                        backgroundColor: tokens.status.hovered,
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
            defaultProps: {
                disableRipple: true,
            },
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
                        color: tokens.status.error,
                    },
                },
            },
        },
        MuiFormControlLabel: {
            styleOverrides: {
                root: {
                    "&.Mui-error": {
                        color: tokens.status.error,
                    },
                },
                label: {
                    width: "100%",
                },
                asterisk: {
                    color: tokens.status.error,
                },
            },
        },
        MuiMenu: {
            styleOverrides: {
                paper: {
                    boxShadow: subtleShadow,
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
                    boxShadow: subtleShadow,
                },
            },
        },
        MuiCard: {
            styleOverrides: {
                root: {
                    boxShadow: "none",
                },
            },
        },
        MuiCardContent: {
            styleOverrides: {
                root: ({ theme: _theme }) => ({
                    "&:last-child": {
                        paddingBottom: _theme.spacing(2),
                    },
                }),
            },
        },
        MuiTypography: {
            styleOverrides: {
                h1: ({ theme: _theme }) => ({
                    marginBottom: _theme.spacing(2),
                }),
                h2: {
                    marginBottom: 15,
                },
                h3: {
                    marginBottom: 2,
                },
                h4: {
                    marginBottom: 2,
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
                            color: tokens.background.white,
                            "& + .MuiSwitch-track": {
                                backgroundColor: tokens.brand.secondary,
                                opacity: 1,
                                border: 0,
                            },
                            "&.Mui-disabled + .MuiSwitch-track": {
                                opacity: 0.5,
                            },
                        },
                        "&.Mui-disabled+.MuiSwitch-track": {
                            backgroundColor: tokens.status.faded,
                        },
                    },
                    "& .MuiSwitch-thumb": {
                        boxSizing: "border-box",
                    },
                    "& .MuiSwitch-track": {
                        backgroundColor: tokens.status.error,
                        opacity: 1,
                    },
                },
            },
        },
        MuiChip: {
            styleOverrides: {
                root: {
                    "& .MuiChip-deleteIcon": {
                        color: colors.black,
                    },
                    padding: 2,
                },
            },
            variants: [
                {
                    props: { color: "success" },
                    style: {
                        background: colors.green400,
                        color: tokens.background.white,
                    },
                },
                {
                    props: { color: "secondary" },
                    style: {
                        color: tokens.background.white,
                    },
                },
                {
                    props: { color: "warningCustom" },
                    style: {
                        background: colors.orange300,
                    },
                },
                {
                    props: { color: "yellowCustom" },
                    style: {
                        background: tokens.status.warning,
                        color: tokens.text.warning,
                    },
                },
                {
                    props: { color: "alias" },
                    style: {
                        backgroundColor: palette.alias.backgroundColor,
                        color: palette.alias.contrastText,
                    },
                },
                {
                    props: { color: "greyCustom" },
                    style: {
                        backgroundColor: tokens.status.faded,
                        color: tokens.background.white,
                    },
                },
            ],
        },
    },
    customShadows: {
        subtle: subtleShadow,
    },
});

export default theme;
