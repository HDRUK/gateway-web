import { useEffect, useState } from "react";
import { Control, useWatch } from "react-hook-form";
import { isEqual, pick } from "lodash";
import { Federation, FederationRunResponse } from "@/interfaces/Federation";
import { Integration, IntegrationForm } from "@/interfaces/Integration";
import usePost from "@/hooks/usePost";
import apis from "@/config/apis";

export const watchFederationKeys = [
    "auth_type",
    "auth_secret_key",
    "endpoint_baseurl",
    "endpoint_datasets",
    "endpoint_dataset",
    "run_time_hour",
    "notifications",
];

interface useRunFederationProps {
    teamId: string;
    integration: Integration | undefined;
    reset: () => void;
    control: Control<IntegrationForm>;
    setValue: (
        key: keyof IntegrationForm,
        value: string | number | boolean | string[] | undefined
    ) => void;
    getValues: () => void;
    tested: boolean;
}

const useRunFederation = ({
    teamId,
    integration,
    reset,
    control,
    tested,
    setValue,
    getValues,
}: useRunFederationProps) => {
    const [runStatus, setRunStatus] = useState<
        "NOT_RUN" | "IS_RUNNING" | "RUN_COMPLETE" | "TESTED_IS_TRUE"
    >("NOT_RUN");

    const [testedConfig, setTestedConfig] = useState<Federation>();

    const [runResponse, setRunResponse] = useState<FederationRunResponse>();

    const fieldsToWatch = useWatch({
        control,
        name: [
            "auth_type",
            "auth_secret_key",
            "endpoint_baseurl",
            "endpoint_datasets",
            "endpoint_dataset",
            "run_time_hour",
            "notifications",
        ],
        defaultValue: undefined,
    });

    useEffect(() => {
        const updatedForm = pick(getValues(), watchFederationKeys);

        // Set initial tested config
        if (!testedConfig) {
            setTestedConfig(updatedForm as unknown as Federation);
            return;
        }

        const configChanges = !isEqual(updatedForm, testedConfig);
        if (configChanges) {
            setRunStatus("NOT_RUN");
            setValue("tested", false);
            setValue("enabled", false);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [fieldsToWatch, testedConfig]);

    useEffect(() => {
        if (!tested && !integration) return;
        if (runStatus !== "NOT_RUN") return;
        if (integration?.tested || tested) {
            setRunStatus("TESTED_IS_TRUE");
        }
    }, [integration, tested, reset, setValue]);

    const runFederationTest = usePost<Omit<Federation, "id">>(
        `${apis.teamsV1Url}/${teamId}/federations/test`,
        {
            itemName: "Integration test",
            successNotificationsOn: false,
        }
    );

    const handleRun = async () => {
        if (!integration) return;

        setRunStatus("IS_RUNNING");

        const payload = pick(
            getValues(),
            watchFederationKeys
        ) as unknown as IntegrationForm;

        const updatedPayload = {
            ...payload,
            run_time_hour: parseInt(payload.run_time_hour, 10),
        } as Federation;

        const response = (await runFederationTest(
            updatedPayload
        )) as unknown as FederationRunResponse;

        /* Send 'runStatus' to show correct section within run component */
        setRunStatus("RUN_COMPLETE");

        /* Update 'tested' property on integration form data */
        setValue("tested", response.success);

        /* Send run response to be rendered within run component */
        setRunResponse(response);
    };

    return {
        runStatus,
        setTestedConfig,
        runResponse,
        handleRun,
    };
};

export default useRunFederation;
