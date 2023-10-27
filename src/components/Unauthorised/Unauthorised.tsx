import Paper from "@/components/Paper";
import Typography from "@/components/Typography";
import { RemoveCircleIcon } from "@/consts/icons";
import theme from "@/config/theme";

const Unauthorised = () => {
    return (
        <Paper sx={{ padding: 3 }}>
            <Typography variant="h2" align="center">
                <RemoveCircleIcon
                    sx={{ color: theme.palette.error.main }}
                    fontSize="large"
                />
            </Typography>
            <Typography variant="h2" align="center">
                401 Unauthorised
            </Typography>
            <Typography align="center">
                You are not authorised to access this page.
            </Typography>
        </Paper>
    );
};

export default Unauthorised;
