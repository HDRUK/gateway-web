"use client";

import { useEffect, useMemo } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useParams, useRouter } from "next/navigation";
import { IntegrationForm, IntegrationPayload } from "@/interfaces/Integration";
import Box from "@/components/Box";
import Button from "@/components/Button";
import Form from "@/components/Form";
import InputWrapper from "@/components/InputWrapper";
import Paper from "@/components/Paper";
import useGetTeam from "@/hooks/useGetTeam";
import usePost from "@/hooks/usePost";
import { useUnsavedChanges } from "@/hooks/useUnsavedChanges";
import apis from "@/config/apis";
import {
    integrationDefaultValues,
    integrationFormFields,
    integrationValidationSchema,
} from "@/config/forms/integration";
import { RouteName } from "@/consts/routeName";
import { requiresSecretKey } from "@/utils/integrations";

const CreateIntegrationForm = () => {
    const { push } = useRouter();
    const params = useParams<{ teamId: string }>();
    const { team } = useGetTeam(params?.teamId as string);

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
        `${apis.teamsV1Url}/${params?.teamId}/federations`,
        {
            shouldFetch: !!params?.teamId,
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
            push(
                `/${RouteName.ACCOUNT}/${RouteName.TEAM}/${params?.teamId}/${RouteName.INTEGRATIONS}/${RouteName.INTEGRATION}/${RouteName.LIST}`
            );
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
