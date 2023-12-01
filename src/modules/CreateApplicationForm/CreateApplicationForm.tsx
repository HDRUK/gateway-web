"use client";

import Box from "@/components/Box";
import Form from "@/components/Form";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";

import Button from "@/components/Button";
import {
    applicationDefaultValues,
    applicationFormFields,
    applicationValidationSchema,
} from "@/config/forms/application";
import InputWrapper from "@/components/InputWrapper";
import { ApplicationForm } from "@/interfaces/Application";
import apis from "@/config/apis";
import usePost from "@/hooks/usePost";
import useAuth from "@/hooks/useAuth";
import Paper from "@/components/Paper";
import { useMemo } from "react";
import { useUnsavedChanges } from "@/hooks/useUnsavedChanges";
import useGetTeam from "@/hooks/useGetTeam";

import { useRouter } from "next/router";
import { AccountTeamUrlQuery } from "@/interfaces/AccountTeamQuery";

const CreateApplicationForm = () => {
    const { user } = useAuth();

    const { query, push } = useRouter();
    const { teamId } = query as AccountTeamUrlQuery;

    const { team } = useGetTeam(teamId);

    const defaultValues = useMemo(() => {
        return {
            user_id: user?.id,
            team_id: parseInt(teamId, 10),
            ...applicationDefaultValues,
        };
    }, [teamId, user?.id]);

    const { control, handleSubmit, reset, formState } =
        useForm<ApplicationForm>({
            mode: "onTouched",
            resolver: yupResolver(applicationValidationSchema),
            defaultValues,
        });

    useUnsavedChanges({
        shouldConfirmLeave: formState.isDirty && !formState.isSubmitSuccessful,
    });

    const updateApplication = usePost<ApplicationForm>(
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
                            value: teamUser.email,
                            label: `${teamUser.firstname} ${teamUser.lastname}`,
                        })),
                    };
                }
                return field;
            }),
        [team]
    );

    const submitForm = async (formData: ApplicationForm) => {
        const payload = { ...applicationDefaultValues, ...formData };
        const response = await updateApplication(payload);

        /* setTimout required to prevent useUnsavedChanges hook firing before formState updates */
        setTimeout(() => {
            push(
                `/account/team/${teamId}/integrations/api-management/create/${response.id}/permissions`
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
                        onClick={() => reset(defaultValues)}
                        color="secondary"
                        variant="outlined">
                        Discard API
                    </Button>
                    <Button type="submit">Save &amp; Continue</Button>
                </Box>
            </Paper>
        </Form>
    );
};

export default CreateApplicationForm;
