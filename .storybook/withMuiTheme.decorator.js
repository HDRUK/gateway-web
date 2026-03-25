import { CssBaseline, ThemeProvider } from "@mui/material";
import theme from "./muiTheme";

export const withMuiTheme = Story => (
    <ThemeProvider theme={theme}>
        <CssBaseline />
        <Story />
    </ThemeProvider>
);
