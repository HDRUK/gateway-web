import { Box } from "@mui/material";

export default function DataList({ children, ...restProps }) {
    return (
        <Box
            {...restProps}
            sx={{
                display: "flex",
                flexDirection: "column",
                gap: 1,
                ...restProps.sx,
            }}>
            {children}
        </Box>
    );
}
