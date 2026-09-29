import { ReactNode } from "react";
import Box from "@mui/material/Box";
import { tokens } from "@hdruk/ui/theme";

export default function AboutLayout({ children }: { children: ReactNode }) {
    return (
        <Box
            sx={{
                backgroundColor: tokens.background.white,
                color: tokens.text.secondaryBlack,
            }}>
            {children}
        </Box>
    );
}
