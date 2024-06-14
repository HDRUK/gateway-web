import { Box, Grid } from "@mui/material";

export default function DataList({ primary, secondary }) {
    return (
        <Box sx={{ display: "flex" }}>
            <Box sx={{ width: "200px" }}>{primary}</Box>
            <Box sx={{ justifyContent: "flex-end" }}>{secondary}</Box>
        </Box>
    );
}
