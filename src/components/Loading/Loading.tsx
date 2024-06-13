import { CircularProgress } from "@mui/material";
import Box from "@/components/Box";

interface LoadingProps {
    size?: number;
}

const Loading = ({ size = 48 }: LoadingProps) => {
    return (
        <Box sx={{ display: "flex", justifyContent: "center" }}>
            <CircularProgress size={size} color="secondary" />
        </Box>
    );
};

export default Loading;
