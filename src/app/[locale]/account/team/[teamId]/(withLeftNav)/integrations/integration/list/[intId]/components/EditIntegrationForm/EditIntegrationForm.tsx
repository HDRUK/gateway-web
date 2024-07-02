"use client";

import { useEffect, useMemo } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { pick } from "lodash";
import { useParams, useRouter } from "next/navigation";
import { Federation } from "@/interfaces/Federation";
import {
    Integration,
    IntegrationForm,
    IntegrationPayload,
} from "@/interfaces/Integration";
import Box from "@/components/Box";
import Button from "@/components/Button";
import Form from "@/components/Form";
import InputWrapper from "@/components/InputWrapper";
import Paper from "@/components/Paper";
import RunFederationTest from "@/components/RunFederationTest";
import Switch from "@/components/Switch";
import Tooltip from "@/components/Tooltip";
import useGet from "@/hooks/useGet";
import useGetTeam from "@/hooks/useGetTeam";
import usePost from "@/hooks/usePost";
import usePut from "@/hooks/usePut";
import useRunFederation, {
    watchFederationKeys,
} from "@/hooks/useRunFederation";
import { useUnsavedChanges } from "@/hooks/useUnsavedChanges";
import apis from "@/config/apis";
import {
    integrationDefaultValues,
    integrationEditFormFields,
    integrationFormFields,
    integrationValidationSchema,
} from "@/config/forms/integration";
import { RouteName } from "@/consts/routeName";
import { requiresSecretKey } from "@/utils/integrations";

const EditIntegrationForm = () => {
    const { push } = useRouter();
    const params = useParams<{
        teamId: string;
        intId: string;
    }>();

    const { data: integration } = useGet<Integration>(
        `${apis.teamsV1Url}/${params?.teamId}/federations/${params?.intId}`,
        { shouldFetch: !!params?.teamId && !!params?.intId }
    );

    const { team } = useGetTeam(params?.teamId as string);

    const isEditing = params?.intId;

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
        useRunFederation({
            teamId: params?.teamId || "",
            integration: integration || {
                ...integrationDefaultValues,
                ...getValues(),
                run_time_hour: parseInt(getValues("run_time_hour"), 10),
                notifications: [],
            },
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

    const createIntegration = usePost<IntegrationPayload>(
        `${apis.teamsV1Url}/${params?.teamId}/federations`,
        {
            shouldFetch: !!params?.teamId,
            itemName: "Integration",
        }
    );

    const updateIntegration = usePut<IntegrationPayload>(
        `${apis.teamsV1Url}/${params?.teamId}/federations`,
        {
            shouldFetch: !!params?.teamId,
            itemName: "Integration",
        }
    );

    const submitForm = async (payload: IntegrationForm) => {
        const runTimeHour = parseInt(payload.run_time_hour, 10);

        if (!isEditing) {
            const createIntegrationResponse = await createIntegration({
                ...integrationDefaultValues,
                ...payload,
                run_time_hour: runTimeHour,
            });

            if (createIntegrationResponse) {
                setTimeout(() => {
                    push(
                        `/${RouteName.ACCOUNT}/${RouteName.TEAM}/${params?.teamId}/${RouteName.INTEGRATIONS}/${RouteName.INTEGRATION}/${RouteName.LIST}`
                    );
                });
            }
        } else {
            const updatedPayload = {
                ...payload,
                run_time_hour: runTimeHour,
            };
            await updateIntegration(payload.id, updatedPayload);
        }
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
            (isEditing ? integrationEditFormFields : integrationFormFields)
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
        [team, auth_type, isEditing]
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
                        <RunFederationTest
                            status={runStatus}
                            runResponse={runResponse}
                            isEnabled={formState.isValid}
                            onRun={handleRun}
                        />
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
