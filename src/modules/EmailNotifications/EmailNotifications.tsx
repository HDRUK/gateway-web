import Box from "@/components/Box";
import BoxContainer from "@/components/BoxContainer";
import InputSectionWrapper from "@/components/InputSectionWrapper";
import Typography from "@/components/Typography";
import {
    emailNotificationValidationSchema,
    emailNotificationDefaultValues,
    emailNotificationFormSections,
    EmailNotification,
} from "@/config/forms/emailNotifications";
import useActionBar from "@/hooks/useActionBar";
import useAuth from "@/hooks/useAuth";
import useGetTeam from "@/hooks/useGetTeam";
import { AccountTeamUrlQuery } from "@/interfaces/AccountTeamQuery";
import ChangesActionBar from "@/modules/ChangesActionBar";
import { getPreferredEmail } from "@/utils/user";
import { useRouter } from "next/router";
import { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useUnsavedChanges } from "@/hooks/useUnsavedChanges";
import { useHasPermissions } from "@/hooks/useHasPermission";

const EmailNotifications = () => {
    const permissions = useHasPermissions();
    const { user } = useAuth();
    const { query } = useRouter();
    const { teamId } = query as AccountTeamUrlQuery;

    const { team } = useGetTeam(teamId);
    const { control, formState, reset } = useForm<EmailNotification>({
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

        const formValues = {
            ...emailNotificationDefaultValues,
            contact_point: team.contact_point,
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

    useEffect(() => {
        /* Only call `showBar` if form is `isDirty` ActionBar is not visible */
        if (formState.isDirty && !store.isVisible) {
            showBar("Notification", {
                component: ChangesActionBar,
                cancelText: "Discard",
                confirmText: "Save",
                changeCount: 1,
                onSuccess: () => {
                    /**
                     * todo: Complete once BE is implemented
                     * handleSubmit(onSubmit)();
                     */
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
                    sections={hydratedSections}
                    control={control}
                />
            </Box>
        </BoxContainer>
    );
};

export default EmailNotifications;
