"use client";

import { useMemo } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useRouter, useParams } from "next/navigation";
import { ApplicationForm } from "@/interfaces/Application";
import Box from "@/components/Box";
import Button from "@/components/Button";
import Form from "@/components/Form";
import InputWrapper from "@/components/InputWrapper";
import Paper from "@/components/Paper";
import useAuth from "@/hooks/useAuth";
import useGetTeam from "@/hooks/useGetTeam";
import usePost from "@/hooks/usePost";
import { useUnsavedChanges } from "@/hooks/useUnsavedChanges";
import apis from "@/config/apis";
import {
    applicationDefaultValues,
    applicationFormFields,
    applicationValidationSchema,
} from "@/config/forms/application";
import { RouteName } from "@/consts/routeName";

const CreateApplicationForm = () => {
    const { user } = useAuth();
    const { push } = useRouter();
    const params = useParams<{ teamId: string }>();
    const { team } = useGetTeam(params?.teamId as string);

    const { control, handleSubmit, reset, formState } =
        useForm<ApplicationForm>({
            mode: "onTouched",
            resolver: yupResolver(applicationValidationSchema),
            defaultValues: applicationDefaultValues,
        });

    useUnsavedChanges({
        shouldConfirmLeave: formState.isDirty && !formState.isSubmitSuccessful,
    });

    const createApplication = usePost<ApplicationForm>(
        `${apis.applicationsV1Url}`,
        {
            itemName: "Application",
        }
    );

    const hydratedFormFields = useMemo(
        () =>
            applicationFormFields.map(field => {
                /* populate 'notifications' with team members */
                if (field.name === "notifications") {
                    return {
                        ...field,
                        options: team?.users?.map(teamUser => ({
                            value: teamUser.id,
                            label: `${teamUser.firstname} ${teamUser.lastname}`,
                        })),
                    };
                }
                return field;
            }),
        [team]
    );

    const submitForm = async (formData: ApplicationForm) => {
        const payload = {
            user_id: user?.id,
            team_id: parseInt(`${params?.teamId}`, 10),
            ...formData,
        };
        const newApp = await createApplication(payload);

        /* setTimout required to prevent useUnsavedChanges hook firing before formState updates */
        setTimeout(() => {
            push(
                `/${RouteName.ACCOUNT}/${RouteName.TEAM}/${params?.teamId}/${RouteName.INTEGRATIONS}/${RouteName.API_MANAGEMENT}/${RouteName.CREATE}/${newApp.id}/${RouteName.PERMISSIONS}`
            );
        });
    };

    return (
        <Form sx={{ maxWidth: 1000 }} onSubmit={handleSubmit(submitForm)}>
            <Paper sx={{ marginBottom: 1 }}>
                <Box>
                    {hydratedFormFields.map(field => (
                        <InputWrapper
                            key={field.name}
                            control={control}
                            {...field}
                        />
                    ))}
                </Box>
            </Paper>
            <Paper>
                <Box
                    sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        marginBottom: "10px",
                    }}>
                    <Button
                        onClick={() => reset(applicationDefaultValues)}
                        color="secondary"
                        variant="outlined">
                        Clear form
                    </Button>
                    <Button type="submit">Save &amp; Continue</Button>
                </Box>
            </Paper>
        </Form>
    );
};

export default CreateApplicationForm;
