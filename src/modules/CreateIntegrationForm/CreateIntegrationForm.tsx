"use client";

import Box from "@/components/Box";
import Form from "@/components/Form";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";

import Button from "@/components/Button";
import {
    integrationDefaultValues,
    integrationFormFields,
    integrationValidationSchema,
} from "@/config/forms/integration";
import InputWrapper from "@/components/InputWrapper";
import apis from "@/config/apis";
import { useRouter } from "next/router";
import usePost from "@/hooks/usePost";
import Paper from "@/components/Paper";
import { useEffect, useMemo } from "react";
import { useUnsavedChanges } from "@/hooks/useUnsavedChanges";
import { IntegrationForm, IntegrationPayload } from "@/interfaces/Integration";
import { requiresSecretKey } from "@/utils/integrations";
import useGetTeam from "@/hooks/useGetTeam";
import { AccountTeamUrlQuery } from "@/interfaces/AccountTeamQuery";

const CreateIntegrationForm = () => {
    const { query, push } = useRouter();
    const { teamId } = query as AccountTeamUrlQuery;
    const { team } = useGetTeam(teamId);

    const { control, handleSubmit, formState, watch, unregister } =
        useForm<IntegrationForm>({
            mode: "onTouched",
            resolver: yupResolver(integrationValidationSchema),
            defaultValues: integrationDefaultValues,
        });

    useUnsavedChanges({
        shouldConfirmLeave: formState.isDirty && !formState.isSubmitSuccessful,
    });

    const createIntegration = usePost<IntegrationPayload>(
        `${apis.teamsV1Url}/${teamId}/federations`,
        {
            shouldFetch: !!teamId,
            itemName: "Integration",
        }
    );

    const submitForm = async (formData: IntegrationForm) => {
        await createIntegration({
            ...integrationDefaultValues,
            ...formData,
            run_time_hour: parseInt(formData.run_time_hour, 10),
        });

        setTimeout(() => {
            push(`/account/team/${teamId}/integrations/integration/list`);
        });
    };

    const auth_type = watch("auth_type");

    useEffect(() => {
        if (!requiresSecretKey(auth_type)) {
            unregister("auth_secret_key");
        }
    }, [auth_type, unregister]);

    const hydratedFormFields = useMemo(
        () =>
            integrationFormFields
                .map(field => {
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
                })
                /* Remove 'auth_secret_key' field if 'auth_type' is set to "NO_AUTH"  */
                .filter(
                    field =>
                        field.name !== "auth_secret_key" ||
                        (field.name === "auth_secret_key" &&
                            requiresSecretKey(auth_type!))
                ),
        [team, auth_type]
    );

    return (
        <Form sx={{ maxWidth: 1000 }} onSubmit={handleSubmit(submitForm)}>
            <Box
                sx={{
                    p: 0,
                    display: "grid",
                    gridTemplateColumns: "repeat(3, 1fr)",
                }}>
                <Paper sx={{ marginBottom: 1, gridColumn: "span 2" }}>
                    <Box padding={0}>
                        {hydratedFormFields.map(field => (
                            <InputWrapper
                                key={field.name}
                                horizontalForm
                                control={control}
                                {...field}
                            />
                        ))}
                    </Box>
                </Paper>
            </Box>
            <Paper>
                <Box
                    padding={0}
                    display="flex"
                    justifyContent="end"
                    marginBottom={10}>
                    <Button type="submit">Save configuration</Button>
                </Box>
            </Paper>
        </Form>
    );
};

export default CreateIntegrationForm;
