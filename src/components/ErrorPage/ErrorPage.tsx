import Paper from "@/components/Paper";
import Typography from "@/components/Typography";
import { RemoveCircleIcon } from "@/consts/icons";
import theme from "@/config/theme";
import { SvgIconComponent } from "@mui/icons-material";

interface ErrorPageProps {
    icon?: SvgIconComponent;
    errorStatusCode?: number;
    errorStatusMessage?: string;
    errorMessage?: string;
}

const ErrorPage = ({
    icon,
    errorStatusCode,
    errorStatusMessage,
    errorMessage,
}: ErrorPageProps) => {
    const Icon = icon || RemoveCircleIcon;

    return (
        <Paper sx={{ padding: 3 }}>
            <Typography variant="h2" align="center">
                <Icon
                    sx={{ color: theme.palette.error.main }}
                    fontSize="large"
                />
            </Typography>
            <Typography variant="h2" align="center">
                {errorStatusCode} {errorStatusMessage}
            </Typography>
            <Typography align="center">{errorMessage}</Typography>
        </Paper>
    );
};

ErrorPage.defaultProps = {
    icon: undefined,
    errorStatusCode: 401,
    errorStatusMessage: "Unauthorised",
    errorMessage: "You are not authorised to access this page.",
};

export default ErrorPage;
