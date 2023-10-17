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
import useGet from "@/hooks/useGet";
import { Team } from "@/interfaces/Team";
import { Integration } from "@/interfaces/Integration";
import { requiresSecretKey } from "@/utils/integrations";

const CreateIntegrationForm = () => {
    const { query } = useRouter();

    const { data: team } = useGet<Team>(`${apis.teamsV1Url}/${query.teamId}`, {
        shouldFetch: !!query.teamId,
    });

    const { control, handleSubmit, formState, watch, unregister } =
        useForm<Integration>({
            mode: "onTouched",
            resolver: yupResolver(integrationValidationSchema),
            defaultValues: integrationDefaultValues,
        });

    useUnsavedChanges({
        shouldConfirmLeave: formState.isDirty && !formState.isSubmitSuccessful,
    });

    const createIntegration = usePost<Integration>(
        `${apis.teamsV1Url}/${query.teamId}/federations`,
        {
            shouldFetch: !!query.teamId,
            itemName: "Integration",
        }
    );

    const submitForm = async (formData: Integration) => {
        await createIntegration({
            ...integrationDefaultValues,
            ...formData,
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
                    if (field.name === "notification") {
                        return {
                            ...field,
                            options: team?.users.map(teamUser => ({
                                value: teamUser.email,
                                label: `${teamUser.firstname} ${teamUser.lastname}`,
                            })),
                        };
                    }
                    if (
                        field.name === "auth_secret_key" &&
                        !requiresSecretKey(auth_type)
                    ) {
                        return null;
                    }
                    return field;
                })
                .filter(field => !!field),
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
                    marginBottom={10}
                    // sx={{
                    //     display: "flex",
                    //     justifyContent: "space-between",
                    //     marginBottom: "10px",
                    // }}
                >
                    <Button type="submit">Save configuration</Button>
                </Box>
            </Paper>
        </Form>
    );
};

export default CreateIntegrationForm;
