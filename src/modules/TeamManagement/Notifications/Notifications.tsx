import Box from "@/components/Box";
import BoxContainer from "@/components/BoxContainer";
import InputSectionWrapper from "@/components/InputSectionWrapper";
import Typography from "@/components/Typography";
import {
    notificationDefaultValues,
    notificationFormSections,
} from "@/config/forms/notifications";
import { useForm } from "react-hook-form";

const Notifications = () => {
    const { control } = useForm({ defaultValues: notificationDefaultValues });
    return (
        <BoxContainer>
            <Box>
                <Typography
                    sx={{
                        fontWeight: 500,
                        fontSize: "18px",
                        marginBottom: "12px",
                    }}>
                    Email notifications
                </Typography>
                <Typography>
                    Team related email notifications will automatically be sent
                    to each team members gateway log in email. Data custodian
                    managers can choose to send notifications to additional
                    email accounts.
                </Typography>
                <InputSectionWrapper
                    sections={notificationFormSections}
                    control={control}
                />
            </Box>
        </BoxContainer>
    );
};

export default Notifications;
