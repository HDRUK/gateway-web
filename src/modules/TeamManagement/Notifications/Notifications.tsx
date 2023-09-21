/* eslint-disable */

/**
 ** TODO: RE-ENABLE LINTING WHEN WORKING ON FEATURE
 */

import Box from "@/components/Box";
import BoxContainer from "@/components/BoxContainer";
import Typography from "@/components/Typography";

const Notifications = () => {
    const notificationList = [
        {
            label: "Metadata managers receive notifications for;",
            items: [
                "New teammember added",
                "FMA integration status",
                "Add dataset",
                "Edit dataset",
                "Archive dataset",
                "Tool uploaded",
                "Paper uploaded",
                "Course uploaded",
            ],
        },
    ];

    return (
        <BoxContainer>
            <Box>
                <Typography
                    sx={{
                        fontWeight: 500,
                        fontSize: "18px",
                        marginBottom: "12px",
                    }}
                >
                    Email notifications
                </Typography>
                <Typography>
                    Team related email notifications will automatically be sent
                    to each team members gateway log in email. Data custodian
                    managers can choose to send notifications to additional
                    email accounts.
                </Typography>
            </Box>
            <Box>
                <Typography>
                    Metadata managers receive notifications for;
                </Typography>
                <ul>
                    <li>New team member added</li>
                    <li>FMA integration status</li>
                </ul>
            </Box>
        </BoxContainer>
    );
};

export default Notifications;
