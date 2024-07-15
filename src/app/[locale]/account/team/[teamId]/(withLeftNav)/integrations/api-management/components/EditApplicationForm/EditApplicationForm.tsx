"use client";

import { useEffect, useMemo } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useParams, useRouter } from "next/navigation";
import {
    Application,
    ApplicationForm,
    ApplicationPayload,
} from "@/interfaces/Application";
import Button from "@/components/Button";
import Form from "@/components/Form";
import InputWrapper from "@/components/InputWrapper";
import Loading from "@/components/Loading";
import Paper from "@/components/Paper";
import Typography from "@/components/Typography";
import useGetTeam from "@/hooks/useGetTeam";
import usePut from "@/hooks/usePut";
import { useUnsavedChanges } from "@/hooks/useUnsavedChanges";
import apis from "@/config/apis";
import {
    applicationEditFormFields,
    applicationValidationSchema,
    applicationDefaultValues,
} from "@/config/forms/application";
import { RouteName } from "@/consts/routeName";
import DeleteApplication from "../DeleteApplication";

interface EditApplicationFormProps {
    application?: Application;
    isTabView?: boolean;
}

const EditApplicationForm = ({
    application,
    isTabView = false,
}: EditApplicationFormProps) => {
    const { push } = useRouter();
    const params = useParams<{ teamId: string }>();
    const { team } = useGetTeam(params?.teamId as string);

    const { control, handleSubmit, reset, formState } =
        useForm<ApplicationForm>({
            resolver: yupResolver(applicationValidationSchema),
            defaultValues: {
                ...applicationDefaultValues,
                ...application,
            },
        });

    useUnsavedChanges({
        shouldConfirmLeave: formState.isDirty && !formState.isSubmitSuccessful,
    });

    useEffect(() => {
        if (!application) return;

        const formData: ApplicationForm = {
            ...application,
            notifications: application?.notifications?.map(
                (notification: { email: string }) => notification.email
            ),
        };
        reset(formData);
    }, [application, reset]);

    const fields = isTabView
        ? applicationEditFormFields
        : applicationEditFormFields.filter(field => field.name !== "enabled");

    const updateApplication = usePut<ApplicationPayload>(
        `${apis.applicationsV1Url}`,
        {
            itemName: "Application",
        }
    );

    const submitForm = async (formData: Application) => {
        const { permissions, ...rest } = application || {};

        const payload: ApplicationPayload = {
            ...rest,
            ...formData,
            permissions: permissions?.map(perm => perm.id),
        };
        await updateApplication(payload.id, payload);
        if (!isTabView) {
            /* setTimout required to prevent useUnsavedChanges hook firing before formState updates */
            setTimeout(() => {
                push(
                    `/${RouteName.ACCOUNT}/${RouteName.TEAM}/${params?.teamId}/${RouteName.INTEGRATIONS}/${RouteName.API_MANAGEMENT}/${RouteName.CREATE}/${payload.id}/${RouteName.PERMISSIONS}`
                );
            });
        }
    };

    const hydratedFormFields = useMemo(
        () =>
            fields.map(field => {
                /* populate 'notifications' with team members */
                if (field.name === "notifications") {
                    return {
                        ...field,
                        options: team?.users?.map(teamUser => ({
                            value: teamUser.email,
                            label: `${teamUser.firstname} ${teamUser.lastname}`,
                        })),
                    };
                }
                return field;
            }),
        [team, fields]
    );

    if (!application) return <Loading />;

    return (
        <>
            <Paper
                sx={{
                    padding: 2,
                    marginBottom: "10px",
                    marginTop: "10px",
                }}>
                <Typography variant="h2">API Management</Typography>
                <Typography>
                    Use this form to create, update and manage your api on the
                    Gateway
                </Typography>
            </Paper>
            <Form onSubmit={handleSubmit(submitForm)}>
                <Paper
                    sx={{
                        marginTop: "10px",
                        marginBottom: "10px",
                        padding: 2,
                    }}>
                    {hydratedFormFields.map(field => (
                        <InputWrapper
                            key={field.name.toString()}
                            control={control}
                            {...field}
                        />
                    ))}
                </Paper>
                <Paper
                    sx={{
                        display: "flex",
                        justifyContent: "end",
                        marginBottom: "10px",
                        padding: 2,
                    }}>
                    <Button type="submit">
                        {isTabView ? "Save changes" : "Save & Continue"}
                    </Button>
                </Paper>
            </Form>
            <Paper
                sx={{
                    padding: 2,
                }}>
                <DeleteApplication applicationId={application.id} />
            </Paper>
        </>
    );
};

export default EditApplicationForm;
