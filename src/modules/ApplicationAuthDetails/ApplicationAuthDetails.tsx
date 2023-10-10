import Box from "@/components/Box";
import Button from "@/components/Button";
import Card from "@/components/Card";
import { Application } from "@/interfaces/Application";
import { copyToClipboard } from "@/utils/general";
import Typography from "@/components/Typography";
import Paper from "@/components/Paper";

interface ApplicationAuthDetailsProps {
    application?: Application;
}

const ApplicationAuthDetails = ({
    application,
}: ApplicationAuthDetailsProps) => {

    return (
        <>
        <Paper sx={{ 
            marginTop: "10px",
            marginBottom: "10px",
            padding: 2,
            }}>
            <Typography variant="h2">Authentication credentials</Typography>
            <Typography>
            These authentication credentials determine how your API interacts with HDR UK Gateway and its permissions.
            </Typography>
        </Paper>

        <Box sx={{ gap: 1, display: "grid", padding: 0 }}>
            <Card
                sx={{
                    display: "flex",
                    justifyContent: "space-evenly",
                }}>
                <Box>
                    <Typography
                        sx={{
                            fontWeight: 600,
                        }}>
                        App ID
                    </Typography>
                    <Typography>
                        This is your Apps unique ID. You will need it to make
                        certain API calls.
                    </Typography>
                </Box>
                <Box>
                    <Typography
                        sx={{
                            marginTop: "10px",
                        }}>
                        {application?.app_id}
                    </Typography>
                </Box>
                <Box>
                    <Button
                        onClick={() => copyToClipboard(application?.app_id)}>
                        Copy
                    </Button>
                </Box>
            </Card>
            <Card
                sx={{
                    display: "flex",
                    justifyContent: "space-evenly",
                }}>
                <Box>
                    <Typography
                        sx={{
                            fontWeight: 600,
                        }}>
                        Client ID
                    </Typography>
                    <Typography>
                        This is your Apps unique ID. You will need it to make
                        certain API calls.
                    </Typography>
                </Box>
                <Box>
                    <Typography
                        sx={{
                            marginTop: "10px",
                        }}>
                        {application?.client_id}
                    </Typography>
                </Box>
                <Box>
                    <Button
                        onClick={() => copyToClipboard(application?.client_id)}>
                        Copy
                    </Button>
                </Box>
            </Card>
        </Box>
        </>
    );
};

ApplicationAuthDetails.defaultProps = {
    application: { app_id: "", client_id: "" },
};

export default ApplicationAuthDetails;
