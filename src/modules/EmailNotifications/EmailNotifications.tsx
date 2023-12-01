"use client";

import Box from "@/components/Box";
import Paper from "@/components/Paper";
import InputSectionWrapper from "@/components/InputSectionWrapper";
import Typography from "@/components/Typography";
import {
    emailNotificationValidationSchema,
    emailNotificationDefaultValues,
    emailNotificationFormSections,
    EmailNotification,
    TeamNotifications,
} from "@/config/forms/emailNotifications";
import useActionBar from "@/hooks/useActionBar";
import useAuth from "@/hooks/useAuth";
import useGetTeam from "@/hooks/useGetTeam";
import ChangesActionBar from "@/modules/ChangesActionBar";
import { getPreferredEmail } from "@/utils/user";
import { useRouter } from "next/router";
import { AccountTeamUrlQuery } from "@/interfaces/AccountTeamQuery";
import { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useUnsavedChanges } from "@/hooks/useUnsavedChanges";
import { useHasPermissions } from "@/hooks/useHasPermission";
import useModal from "@/hooks/useModal";
import { colors } from "@/config/theme";
import usePost from "@/hooks/usePost";
import apis from "@/config/apis";
import EmailNotificationDescriptions from "../EmailNotificationDescriptions";

const EmailNotifications = () => {
    const permissions = useHasPermissions();
    const { showModal } = useModal();
    const [shouldSubmit, setShouldSubmit] = useState<boolean>(false);
    const { user } = useAuth();

    const { query } = useRouter();
    const { teamId } = query as AccountTeamUrlQuery;

    const { team } = useGetTeam(teamId);
    const { control, formState, handleSubmit, reset, watch } =
        useForm<EmailNotification>({
            defaultValues: emailNotificationDefaultValues,
            resolver: yupResolver(emailNotificationValidationSchema),
        });

    const { showBar, hideBar, store, updateStoreProps } = useActionBar();

    const team_email = watch("team_email");
    const user_notification_status = watch("user_notification_status");
    const team_notification_status = watch("team_notification_status");

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

        console.log(team);

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
            changeCount: Object.keys(formState.dirtyFields).length,
        });
    }, [formState, updateStoreProps]);

    const updateNotificationEmails = usePost<TeamNotifications>(
        `${apis.teamsV1Url}/${teamId}/notifications`,
        {
            itemName: "Team Notification",
        }
    );

    const onSaveTeamEmail = () => {
        const payload = {
            user_notification_status,
            team_notification_status,
            team_emails: [team_email],
        };
        updateNotificationEmails(payload);
    };

    useEffect(() => {
        if (!shouldSubmit) return;
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
            onSuccess: () => {
                handleSubmit(onSaveTeamEmail)();
                setShouldSubmit(false);
            },
            onCancel: () => {
                setShouldSubmit(false);
            },
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [
        shouldSubmit,
        team_email,
        team_notification_status,
        user_notification_status,
    ]);

    useEffect(() => {
        /* Only call `showBar` if form is `isDirty` ActionBar is not visible */
        if (formState.isDirty && !store.isVisible) {
            showBar("Notification", {
                component: ChangesActionBar,
                cancelText: "Discard",
                confirmText: "Save",
                changeCount: 1,
                onSuccess: () => {
                    setShouldSubmit(true);
                },
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
                    Team related email notification will automatically be send
                    to each team members preferred Gateway contact email. Team
                    Admins can assign an alternative team email account to send
                    notification. Impacted team members will be automatically
                    notified when a role is assigned is removed
                </Typography>
                <EmailNotificationDescriptions />
                <InputSectionWrapper
                    sections={hydratedSections}
                    control={control}
                />
            </Box>
        </Paper>
    );
};

export default EmailNotifications;
