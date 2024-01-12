import { Application } from "@/interfaces/Application";
import BoxContainer from "@/components/BoxContainer";
import CopyableCard from "@/components/CopyableCard";
import Paper from "@/components/Paper";
import Typography from "@/components/Typography";

interface ApplicationAuthDetailsProps {
    application?: Application;
}

const ApplicationAuthDetails = ({
    application,
}: ApplicationAuthDetailsProps) => {
    const credentials = [
        {
            label: "App ID",
            value: application?.app_id,
            description:
                "This is your App's unique ID. You will need it to make certain API calls.",
        },
        {
            label: "Client ID",
            value: application?.client_id,
            description:
                "This is your App's unique client ID. You will need it to make certain API calls.",
        },
    ];

    return (
        <>
            <Paper
                sx={{
                    marginTop: "10px",
                    marginBottom: "10px",
                    padding: 2,
                }}>
                <Typography variant="h2">Authentication credentials</Typography>
                <Typography>
                    These authentication credentials determine how your API
                    interacts with HDR UK Gateway and its permissions.
                </Typography>
            </Paper>

            <BoxContainer>
                {credentials.map(cred => (
                    <CopyableCard key={cred.label} {...cred} />
                ))}
            </BoxContainer>
        </>
    );
};

export default ApplicationAuthDetails;
