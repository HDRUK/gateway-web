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
import { useRouter } from "next/router";
import Paper from "@/components/Paper";
import { useEffect, useMemo } from "react";
import { useUnsavedChanges } from "@/hooks/useUnsavedChanges";
import useGet from "@/hooks/useGet";
import { Integration, IntegrationPayload } from "@/interfaces/Integration";
import { requiresSecretKey } from "@/utils/integrations";
import usePut from "@/hooks/usePut";
import RunFederationTest from "@/components/RunFederationTest";
import Switch from "@/components/Switch";
import Tooltip from "@/components/Tooltip";
import { useGetTeam } from "@/hooks/useGetTeam";
import { AccountTeamUrlQuery } from "@/interfaces/AccountTeamQuery";

const EditIntegrationForm = () => {
    const { query } = useRouter();
    const { teamId, intId } = query as AccountTeamUrlQuery;

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
        unregister,
        setValue,
    } = useForm<IntegrationPayload>({
        mode: "onTouched",
        resolver: yupResolver(integrationValidationSchema),
        defaultValues: integrationDefaultValues,
    });

    useEffect(() => {
        reset({
            ...integration,
            notifications: integration?.notifications?.map(
                (notification: { email: string }) => notification.email
            ),
        });
    }, [integration, reset]);

    useUnsavedChanges({
        shouldConfirmLeave: formState.isDirty && !formState.isSubmitSuccessful,
    });

    const updateIntegration = usePut<Integration>(
        `${apis.teamsV1Url}/${teamId}/federations`,
        {
            shouldFetch: !!teamId,
            itemName: "Integration",
        }
    );

    const submitForm = async (payload: Integration) => {
        await updateIntegration(payload.id, payload);
    };

    const handleRun = (testStatus: boolean) => {
        setValue("tested", testStatus);
    };

    const tested = watch("tested");
    const auth_type = watch("auth_type");

    useEffect(() => {
        if (!requiresSecretKey(auth_type)) {
            unregister("auth_secret_key");
        }
    }, [auth_type, unregister]);

    const hydratedFormFields = useMemo(
        () =>
            integrationEditFormFields
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
                    gap: 1,
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
                                teamId={teamId}
                                isEnabled={formState.isValid}
                                federation={{
                                    auth_type: integration.auth_type,
                                    auth_secret_key:
                                        integration.auth_secret_key,
                                    endpoint_baseurl:
                                        integration.endpoint_baseurl,
                                    endpoint_datasets:
                                        integration.endpoint_datasets,
                                    endpoint_dataset:
                                        integration.endpoint_dataset,
                                    run_time_hour: integration.run_time_hour,
                                    enabled: integration.enabled,
                                }}
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
