import Box from "@/components/Box";
import BoxContainer from "@/components/BoxContainer";
import Button from "@/components/Button";
import { Application } from "@/interfaces/Application";
import { Typography } from "@mui/material";

interface AuthDetailsProps {
    application?: Application;
}

const AuthDetails = ({ application }: AuthDetailsProps) => {
    return (
        <>
            <BoxContainer
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
                        onClick={() => {
                            navigator.clipboard.writeText(
                                application?.app_id || ""
                            );
                        }}>
                        Copy
                    </Button>
                </Box>
            </BoxContainer>
            <BoxContainer
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
                        onClick={() => {
                            navigator.clipboard.writeText(
                                application?.client_id || ""
                            );
                        }}>
                        Copy
                    </Button>
                </Box>
            </BoxContainer>
        </>
    );
};

AuthDetails.defaultProps = { application: { app_id: "", client_id: "" } };

export default AuthDetails;
