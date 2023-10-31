import Box from "@/components/Box";
import BoxContainer from "@/components/BoxContainer";
import InputSectionWrapper from "@/components/InputSectionWrapper";
import Typography from "@/components/Typography";
import {
    notificationDefaultValues,
    notificationFormSections,
} from "@/config/forms/notifications";
import useActionBar from "@/hooks/useActionBar";
import useAuth from "@/hooks/useAuth";
import useGetTeam from "@/hooks/useGetTeam";
import { AccountTeamUrlQuery } from "@/interfaces/AccountTeamQuery";
import ChangesActionBar from "@/modules/ChangesActionBar";
import { getProfileEmail } from "@/utils/user";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { useForm } from "react-hook-form";

const Notifications = () => {
    const { user } = useAuth();
    const { query } = useRouter();
    const { teamId } = query as AccountTeamUrlQuery;
    const { control, formState, reset } = useForm({
        defaultValues: notificationDefaultValues,
    });

    const { team } = useGetTeam(teamId);
    const { showBar, hideBar, store } = useActionBar();

    useEffect(() => {
        /* Only call `showBar` if form is `isDirty` ActionBar is not visible */
        if (formState.isDirty && !store.isVisible) {
            showBar("Notification", {
                component: ChangesActionBar,
                cancelText: "Discard",
                confirmText: "Save",
                changeCount: 1,
                onSuccess: () => {
                    // handleSubmit(onSubmit)();
                },
                onCancel: () => {
                    // reset(originalFormValues);
                },
            });
        }
    }, [formState.isDirty, store.isVisible]);

    useEffect(() => {
        if (!team || !user) return;
        reset({
            contact_point: team.contact_point,
            profile_email: getProfileEmail(user),
        });
    }, [reset, team, user]);

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
                <Typography
                    sx={{
                        marginBottom: 3,
                    }}>
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
