import { Box, BoxProps } from "@mui/material";

type DataListProps = BoxProps;

export default function DataList({ children, ...restProps }: DataListProps) {
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
