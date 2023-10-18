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
import Paper from "@/components/Paper";
import { useEffect, useMemo } from "react";
import { useUnsavedChanges } from "@/hooks/useUnsavedChanges";
import useGet from "@/hooks/useGet";
import { Team } from "@/interfaces/Team";
import { Integration } from "@/interfaces/Integration";
import { requiresSecretKey } from "@/utils/integrations";
import usePut from "@/hooks/usePut";

const EditIntegrationForm = () => {
    const { query } = useRouter();
    const { data: integration } = useGet<Integration>(
        `${apis.teamsV1Url}/${query.teamId}/federations/${query.intId}`,
        { shouldFetch: !!query.teamId || !!query.intId }
    );
    const { data: team } = useGet<Team>(`${apis.teamsV1Url}/${query.teamId}`, {
        shouldFetch: !!query.teamId,
    });

    const { control, handleSubmit, reset, formState, watch, unregister } =
        useForm<Integration>({
            mode: "onTouched",
            resolver: yupResolver(integrationValidationSchema),
            defaultValues: integrationDefaultValues,
        });

    useEffect(() => {
        reset(integration);
    }, [integration, reset]);

    useUnsavedChanges({
        shouldConfirmLeave: formState.isDirty && !formState.isSubmitSuccessful,
    });

    const updateIntegration = usePut<Integration>(
        `${apis.teamsV1Url}/${query.teamId}/federations/`,
        {
            shouldFetch: !!query.teamId,
            itemName: "Integration",
        }
    );

    const submitForm = async (payload: Integration) => {
        await updateIntegration(payload.id, payload);
    };

    const auth_type = watch("auth_type");

    useEffect(() => {
        if (!requiresSecretKey(auth_type)) {
            unregister("auth_secret_key");
        }
    }, [auth_type, unregister]);

    const runTest = () => {
        console.log("reached");
        fetch("https://metadata-fed:9889/test", {
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
            },
            method: "POST",
            body: JSON.stringify(integration),
        })
            .then(res => {
                // await res = res.json()
                console.log("res:", res);
            })
            .catch(e => console.log("e: ", e));
    };
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
                <Paper>
                    <Button onClick={() => runTest()}>Run test</Button>
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

export default EditIntegrationForm;
