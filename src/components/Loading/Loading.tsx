/** @jsxImportSource @emotion/react */
import { CircularProgress } from "@mui/material";
import Box from "../Box";

const Loading = () => {
    return (
        <Box sx={{ display: "flex", justifyContent: "center" }}>
            <CircularProgress color="secondary" />
        </Box>
    );
};

export default Loading;
