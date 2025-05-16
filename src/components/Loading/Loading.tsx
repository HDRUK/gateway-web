import { CircularProgress } from "@mui/material";
import { visuallyHidden } from "@mui/utils";
import Box from "@/components/Box";

interface LoadingProps {
    size?: number;
    ariaLabel?: string;
}

const Loading = ({ size = 48, ariaLabel = "Loading" }: LoadingProps) => {
    return (
        <Box
            sx={{ display: "flex", justifyContent: "center" }}
            aria-live="polite">
            <CircularProgress size={size} color="secondary" role="status" />
            <span style={visuallyHidden} role="alert">
                {ariaLabel}
            </span>
        </Box>
    );
};

export default Loading;
