"use client";

import { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useRouter } from "next/navigation";
import { Team } from "@/interfaces/Team";
import Box from "@/components/Box";
import Form from "@/components/Form";
import InputSectionWrapper from "@/components/InputSectionWrapper";
import Paper from "@/components/Paper";
import Typography from "@/components/Typography";
import ChangesActionBar from "@/modules/ChangesActionBar";
import useActionBar from "@/hooks/useActionBar";
import useAuth from "@/hooks/useAuth";
import useModal from "@/hooks/useModal";
import usePost from "@/hooks/usePost";
import { useUnsavedChanges } from "@/hooks/useUnsavedChanges";
import apis from "@/config/apis";
import {
    emailNotificationValidationSchema,
    emailNotificationDefaultValues,
    emailNotificationFormSections,
    EmailNotification,
    TeamNotifications,
    TeamNotificationsForm,
} from "@/config/forms/emailNotifications";
import { colors } from "@/config/theme";
import { getPreferredEmail } from "@/utils/user";
import EmailNotificationDescriptions from "../EmailNotificationDescriptions";

interface EmailNotificationsProps {
    team: Team;
    permissions: { [key: string]: boolean };
}

const EmailNotifications = ({ permissions, team }: EmailNotificationsProps) => {
    const { showModal } = useModal();
    const router = useRouter();
    const { user } = useAuth();

    const { control, formState, handleSubmit, reset } =
        useForm<EmailNotification>({
            mode: "onChange",
            defaultValues: emailNotificationDefaultValues,
            resolver: yupResolver(emailNotificationValidationSchema),
        });

    const { showBar, hideBar, store, updateStoreProps } = useActionBar();

    useUnsavedChanges({
        shouldConfirmLeave: formState.isDirty && !formState.isSubmitSuccessful,
    });

    const [originalFormValues, setOriginalFormValues] = useState({});

    const hydratedSections = useMemo(() => {
        const [mySection, teamSection] = emailNotificationFormSections;
        const isTeamAdmin =
            permissions[
                "fe.account.team_management.notifications.team_section"
            ];

        return [
            mySection,
            {
                ...teamSection,
                fields: teamSection.fields.map(field => ({
                    ...field,
                    title: !isTeamAdmin
                        ? "You do not have permission to edit this field"
                        : "",
                    disabled: !isTeamAdmin,
                })),
            },
        ];
    }, [permissions]);

    useEffect(() => {
        if (!team || !user) return;

        const team_notification_emails = team.notifications.map(n => n.email);

        const formValues = {
            ...emailNotificationDefaultValues,
            team_notification_status: team.notification_status,
            team_email:
                team_notification_emails.length > 0
                    ? team_notification_emails[0]
                    : null,
            profile_email: getPreferredEmail(user),
        };

        setOriginalFormValues(formValues);
        /* Set default values on form */
        reset(formValues);
    }, [reset, team, user]);

    /* Increment custom `changeCount` prop within 'ActionBarProvider' using 'updateStoreProps' */
    useEffect(() => {
        updateStoreProps({
            formId: "action-bar-form",
            confirmType: "submit",
            changeCount: Object.keys(formState.dirtyFields).length,
        });
    }, [formState, updateStoreProps]);

    const updateNotificationEmails = usePost<TeamNotifications>(
        `${apis.teamsV1Url}/${team.id}/notifications`,
        {
            itemName: "Team Notification",
        }
    );

    const submitForm = async (formData: TeamNotificationsForm) => {
        const { team_email, ...rest } = formData;
        const payload = {
            ...rest,
            team_emails: team_email ? [team_email] : [],
        };
        showModal({
            confirmText: "Save update",
            cancelText: "No, nevermind",
            title: "Email notifications",
            content: (
                <Box>
                    <Typography sx={{ mb: 3 }}>
                        Are you sure you want to save your update to email
                        notifications? Please make sure any team email addresses
                        you have entered are correct.
                    </Typography>
                    {team_email && (
                        <Box sx={{ display: "flex", p: 0, gap: 2 }}>
                            <Typography color={colors.grey600}>
                                Team Emails:
                            </Typography>
                            <Typography>{team_email}</Typography>
                        </Box>
                    )}
                </Box>
            ),
            onSuccess: async () => {
                await updateNotificationEmails(payload);
                router.refresh();
            },
        });
    };

    useEffect(() => {
        /* Only call `showBar` if form is `isDirty` ActionBar is not visible */
        if (formState.isDirty && !store.isVisible) {
            showBar("Notification", {
                component: ChangesActionBar,
                cancelText: "Discard",
                confirmText: "Save",
                changeCount: 1,
                onCancel: () => {
                    reset(originalFormValues);
                },
            });
        }
        if (!formState.isDirty && store.isVisible) {
            hideBar();
        }
    }, [
        formState.isDirty,
        hideBar,
        originalFormValues,
        reset,
        showBar,
        store.isVisible,
    ]);

    return (
        <Form id="action-bar-form" onSubmit={handleSubmit(submitForm)}>
            <Paper>
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
                        Team related email notification will automatically be
                        send to each team members preferred Gateway contact
                        email. Team Admins can assign an alternative team email
                        account to send notification. Impacted team members will
                        be automatically notified when a role is assigned is
                        removed
                    </Typography>
                    <EmailNotificationDescriptions />
                    <InputSectionWrapper
                        sections={hydratedSections}
                        control={control}
                    />
                </Box>
            </Paper>
        </Form>
    );
};

export default EmailNotifications;
