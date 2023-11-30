"use client";

import Box from "@/components/Box";
import Form from "@/components/Form";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import Button from "@/components/Button";
import {
    integrationDefaultValues,
    integrationEditFormFields,
    integrationValidationSchema,
} from "@/config/forms/integration";
import InputWrapper from "@/components/InputWrapper";
import apis from "@/config/apis";
import { useSearchParams } from "next/navigation";
import Paper from "@/components/Paper";
import { useEffect, useMemo } from "react";
import { useUnsavedChanges } from "@/hooks/useUnsavedChanges";
import useGet from "@/hooks/useGet";
import {
    Integration,
    IntegrationForm,
    IntegrationPayload,
} from "@/interfaces/Integration";
import { requiresSecretKey } from "@/utils/integrations";
import usePut from "@/hooks/usePut";
import RunFederationTest from "@/components/RunFederationTest";
import Switch from "@/components/Switch";
import Tooltip from "@/components/Tooltip";
import useGetTeam from "@/hooks/useGetTeam";
import useRunFederation, {
    watchFederationKeys,
} from "@/hooks/useRunFederation";
import { pick } from "lodash";
import { Federation } from "@/interfaces/Federation";

const EditIntegrationForm = () => {
    const searchParams = useSearchParams();
    const teamId = searchParams.get("teamId") as string;
    const intId = searchParams.get("intId") as string;

    const { data: integration } = useGet<Integration>(
        `${apis.teamsV1Url}/${teamId}/federations/${intId}`,
        { shouldFetch: !!teamId || !!intId }
    );

    const { team } = useGetTeam(teamId);

    const {
        control,
        handleSubmit,
        reset,
        formState,
        watch,
        setValue,
        getValues,
        unregister,
    } = useForm<IntegrationForm>({
        mode: "onTouched",
        resolver: yupResolver(integrationValidationSchema),
        defaultValues: integrationDefaultValues,
    });

    const { runStatus, setTestedConfig, runResponse, handleRun } =
        useRunFederation<IntegrationForm>({
            teamId,
            integration,
            control,
            reset,
            getValues,
            setValue,
        });

    useEffect(() => {
        if (!integration) return;

        /* Populate form with saved integration */
        const formData: IntegrationForm = {
            ...integration,
            run_time_hour: integration.run_time_hour
                .toString()
                .padStart(2, "0"),
            notifications: integration?.notifications?.map(
                (notification: { email: string }) => notification.email
            ),
        };

        const federationFields = pick(
            getValues(),
            watchFederationKeys
        ) as unknown as Federation;

        setTestedConfig(federationFields);
        reset(formData);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [integration, reset]);

    useUnsavedChanges({
        shouldConfirmLeave: formState.isDirty && !formState.isSubmitSuccessful,
    });

    const updateIntegration = usePut<IntegrationPayload>(
        `${apis.teamsV1Url}/${teamId}/federations`,
        {
            shouldFetch: !!teamId,
            itemName: "Integration",
        }
    );

    const submitForm = async (payload: IntegrationForm) => {
        const updatedPayload = {
            ...payload,
            run_time_hour: parseInt(payload.run_time_hour, 10),
        };
        await updateIntegration(payload.id, updatedPayload);
    };

    const tested = watch("tested");
    const auth_type = watch("auth_type");

    /* unregister 'auth_secret_key' if 'auth_type' is set to "NO_AUTH" */
    useEffect(() => {
        if (!requiresSecretKey(auth_type!)) {
            unregister("auth_secret_key");
        }
    }, [auth_type, unregister]);

    const hydratedFormFields = useMemo(
        () =>
            integrationEditFormFields
                .map(field => {
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
                    gap: 1,
                    display: "grid",
                    gridTemplateColumns: "repeat(3, 1fr)",
                }}>
                <Paper sx={{ marginBottom: 1, gridColumn: "span 2" }}>
                    <Box padding={0}>
                        {hydratedFormFields.map(field => (
                            <InputWrapper
                                key={field.name.toString()}
                                horizontalForm
                                control={control}
                                {...field}
                            />
                        ))}
                    </Box>
                </Paper>
                <Box
                    sx={{
                        p: 0,
                        gap: 1,
                        display: "flex",
                        flexDirection: "column",
                    }}>
                    <Paper sx={{ p: 1 }}>
                        <Box sx={{ display: "flex", justifyContent: "center" }}>
                            <Tooltip
                                placement="bottom"
                                title={
                                    tested
                                        ? ""
                                        : "You must run a successful test before you can Enable the integration."
                                }>
                                <Switch
                                    unCheckedLabel="Disabled"
                                    checkedLabel="Enabled"
                                    disabled={!tested}
                                    control={control}
                                    name="enabled"
                                    formControlSx={{ mb: 0 }}
                                />
                            </Tooltip>
                        </Box>
                    </Paper>
                    <Box sx={{ p: 0, flex: 1 }}>
                        {integration && (
                            <RunFederationTest
                                status={runStatus}
                                runResponse={runResponse}
                                isEnabled={formState.isValid}
                                onRun={handleRun}
                            />
                        )}
                    </Box>
                </Box>
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
