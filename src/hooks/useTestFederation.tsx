import { useEffect, useState } from "react";
import { Control, useWatch } from "react-hook-form";
import { isEqual, pick } from "lodash";
import {
    Federation,
    FederationTestResponse,
    FederationTestStatus,
} from "@/interfaces/Federation";
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

interface useTestFederationProps {
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

const useTestFederation = ({
    teamId,
    integration,
    reset,
    control,
    tested,
    setValue,
    getValues,
}: useTestFederationProps) => {
    const [testStatus, setTestStatus] = useState<FederationTestStatus>(
        FederationTestStatus.NOT_RUN
    );

    const [testedConfig, setTestedConfig] = useState<Federation>();

    const [testResponse, setTestResponse] = useState<FederationTestResponse>();

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
            setTestStatus(FederationTestStatus.NOT_RUN);
            setValue("tested", false);
            setValue("enabled", false);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [fieldsToWatch, testedConfig]);

    useEffect(() => {
        if (!tested && !integration) return;
        if (testStatus !== FederationTestStatus.NOT_RUN) return;
        if (integration?.tested || tested) {
            setTestStatus(FederationTestStatus.TESTED_IS_TRUE);
        }
    }, [integration, tested, reset, setValue]);

    const runFederationTest = usePost<Omit<Federation, "id"> & { id?: number }>(
        `${apis.teamsV1Url}/${teamId}/federations/test`,
        {
            itemName: "Integration test",
            successNotificationsOn: false,
        }
    );

    const handleTest = async () => {
        if (!integration) return;

        setTestStatus(FederationTestStatus.IS_RUNNING);

        const payload = pick(
            getValues(),
            watchFederationKeys
        ) as unknown as IntegrationForm;

        const updatedPayload = {
            ...payload,
            run_time_hour: parseInt(payload.run_time_hour, 10),
            ...("id" in integration ? { id: integration.id } : {}),
        } as Federation;

        const response = (await runFederationTest(
            updatedPayload
        )) as unknown as FederationTestResponse;

        /* Send 'testStatus' to show correct section within run component */
        setTestStatus(FederationTestStatus.RUN_COMPLETE);

        /* Update 'tested' property on integration form data */
        setValue("tested", response.success);

        /* Send test response to be rendered within run component */
        setTestResponse(response);
    };

    return {
        testStatus,
        setTestedConfig,
        testResponse,
        handleTest,
    };
};

export default useTestFederation;
