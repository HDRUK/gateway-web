import Paper from "@/components/Paper";
import Typography from "@/components/Typography";
import { errors, AllowedErrors } from "@/config/errors";
import { RemoveCircleIcon } from "@/consts/icons";

interface ErrorDisplayProps {
    variant: AllowedErrors;
}

const ErrorDisplay = ({ variant }: ErrorDisplayProps) => {
    const errorStatusCode = variant;
    const {
        statusMessage: errorStatusMessage,
        message: errorMessage,
        icon,
    } = errors[errorStatusCode];

    const Icon = icon || RemoveCircleIcon;

    return (
        <Paper sx={{ padding: 3 }}>
            <Typography variant="h2" align="center">
                <Icon color="error" fontSize="large" />
            </Typography>

            <Typography variant="h2" align="center">
                {errorStatusCode} {errorStatusMessage}
            </Typography>
            <Typography align="center">{errorMessage}</Typography>
        </Paper>
    );
};

export default ErrorDisplay;
