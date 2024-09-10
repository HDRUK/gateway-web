import * as React from "react";
import { Box } from "@mui/material";
import { getHomePage } from "@/utils/cms";
import Homepage from "./components/Homepage";

export default async function HomePage() {
    const cmsContent = await getHomePage();
    return (
        <Box component="section" sx={{ overflowX: "hidden" }}>
            <Homepage cmsContent={cmsContent} />
        </Box>
    );
}
