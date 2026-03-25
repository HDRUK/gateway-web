import { createTheme } from "@mui/material/styles";
import baseTheme from "../src/config/theme";

const storybookTheme = createTheme({
    ...baseTheme,
    typography: {
        fontFamily: '"Source Sans 3"',
        body1: {
            fontSize: 14,
        },
    },
});

export default storybookTheme;
