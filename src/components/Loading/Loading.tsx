import { CircularProgress } from "@mui/material";
import Box from "@/components/Box";

interface LoadingProps {
    size?: number;
    ariaLabel?: string;
}

const Loading = ({ size = 48, ariaLabel = "Loading" }: LoadingProps) => {
    return (
        <Box sx={{ display: "flex", justifyContent: "center" }}>
            <CircularProgress
                size={size}
                color="secondary"
                aria-live="polite"
                aria-label={ariaLabel}
                role="status"
            />
        </Box>
    );
};

export default Loading;
