import { CssBaseline, ThemeProvider } from "@mui/material";
import theme from "../src/config/theme";

export const withMuiTheme = Story => {
    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <Story />
        </ThemeProvider>
    );
};
