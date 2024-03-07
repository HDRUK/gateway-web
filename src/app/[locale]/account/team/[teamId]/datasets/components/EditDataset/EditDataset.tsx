"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { omit, get } from "lodash";
import { useTranslations } from "next-intl";
import { useParams, useRouter } from "next/navigation";
import { Dataset, Metadata, NewDataset } from "@/interfaces/Dataset";
import Button from "@/components/Button";
import DynamicInputWrapper from "@/components/DynamicInputWrapper";
import Form from "@/components/Form";
import Loading from "@/components/Loading";
import Paper from "@/components/Paper";
import useGet from "@/hooks/useGet";
import usePost from "@/hooks/usePost";
import { useUnsavedChanges } from "@/hooks/useUnsavedChanges";
import apis from "@/config/apis";
import { datasetValidationSchema } from "@/config/forms/dataset";
import { RouteName } from "@/consts/routeName";
import {
    ACCOUNT,
    COMPONENTS,
    DATASETS,
    PAGES,
    TEAM,
} from "@/consts/translation";

interface EditDatasetProps {
    isDuplicate?: boolean;
}

const EditDataset = ({ isDuplicate = false }: EditDatasetProps) => {
    const t = useTranslations(
        `${PAGES}.${ACCOUNT}.${TEAM}.${DATASETS}.${COMPONENTS}.EditDataset`
    );

    const params = useParams<{
        teamId: string;
        datasetId: string;
    }>();
    const { push } = useRouter();

    const { data: dataset } = useGet<Dataset>(
        `${apis.datasetsV1Url}/${params?.datasetId}`,
        { shouldFetch: !!params?.teamId || !!params?.datasetId }
    );

    const createDataset = usePost<NewDataset>(apis.datasetsV1Url, {
        localeKey: "duplicateDataset",
    });

    const { control, handleSubmit, formState, reset } = useForm<Metadata>({
        resolver: yupResolver(datasetValidationSchema),
    });

    useEffect(() => {
        const formData = isDuplicate
            ? {
                  ...omit(
                      dataset?.latest_metadata.metadata.metadata,
                      "summary.title"
                  ),
              }
            : { ...dataset?.latest_metadata.metadata.metadata };
        reset(formData);
    }, [reset, dataset, isDuplicate]);

    useUnsavedChanges({
        shouldConfirmLeave: formState.isDirty && !formState.isSubmitSuccessful,
    });

    const submitForm = async (formData: Metadata) => {
        if (isDuplicate) {
            const newId = await createDataset({
                ...omit(dataset, ["id", "latest_metadata"]),
                status: "DRAFT",
                metadata: { metadata: formData },
            });
            setTimeout(() => {
                push(
                    `/${RouteName.ACCOUNT}/${RouteName.TEAM}/${params?.teamId}/${RouteName.DATASETS}/${newId}`
                );
            });
        } else {
            // todo: To be implemented as part of the edit task
            const updatePayload = {
                ...omit(dataset, ["latest_metadata"]),
                metadata: {
                    ...dataset?.latest_metadata.metadata,
                    metadata: formData,
                },
            };
            console.log("updatePayload; ", updatePayload);
        }
    };

    if (!dataset) return <Loading />;

    return (
        <Form onSubmit={handleSubmit(submitForm)}>
            <Paper
                sx={{
                    marginTop: "10px",
                    marginBottom: "10px",
                    padding: 2,
                }}>
                <DynamicInputWrapper
                    control={control}
                    level={get(dataset, "latest_metadata.metadata.metadata")}
                />
            </Paper>
            <Paper
                sx={{
                    display: "flex",
                    justifyContent: "end",
                    marginBottom: "10px",
                    padding: 2,
                }}>
                <Button type="submit">
                    {isDuplicate ? t("duplicateButton") : t("editButton")}
                </Button>
            </Paper>
        </Form>
    );
};

export default EditDataset;
