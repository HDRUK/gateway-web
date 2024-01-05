"use client";

import Form from "@/components/Form";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";

import Button from "@/components/Button";
import { datasetValidationSchema } from "@/config/forms/dataset";

import apis from "@/config/apis";
import Loading from "@/components/Loading";
import Paper from "@/components/Paper";
import { useUnsavedChanges } from "@/hooks/useUnsavedChanges";
import { useParams, useRouter } from "next/navigation";
import { Dataset, Metadata, NewDataset } from "@/interfaces/Dataset";
import useGet from "@/hooks/useGet";
import usePost from "@/hooks/usePost";
import { omit, get } from "lodash";
import { RouteName } from "@/consts/routeName";
import { useEffect } from "react";
import DynamicInputWrapper from "@/components/DynamicInputWrapper";
import { useTranslations } from "next-intl";
import { ACCOUNT, DATASETS, PAGES, TEAM } from "@/consts/translation";

interface EditDatasetProps {
    isDuplicate?: boolean;
}

const EditDataset = ({ isDuplicate = false }: EditDatasetProps) => {
    const t = useTranslations(`${PAGES}.${ACCOUNT}.${TEAM}.${DATASETS}`);

    const { teamId, datasetId } = useParams();
    const { push } = useRouter();

    const { data: dataset } = useGet<Dataset>(
        `${apis.datasetsV1Url}/${datasetId}`,
        { shouldFetch: !!teamId || !!datasetId }
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
                      dataset?.versions[0].metadata.metadata,
                      "summary.title"
                  ),
              }
            : { ...dataset?.versions[0].metadata.metadata };
        reset(formData);
    }, [reset, dataset, isDuplicate]);

    useUnsavedChanges({
        shouldConfirmLeave: formState.isDirty && !formState.isSubmitSuccessful,
    });

    const submitForm = async (formData: Metadata) => {
        if (isDuplicate) {
            const newId = await createDataset({
                ...omit(dataset, ["id", "versions"]),
                status: "DRAFT",
                metadata: { metadata: formData },
            });
            setTimeout(() => {
                push(
                    `/${RouteName.ACCOUNT}/${RouteName.TEAM}/${teamId}/${RouteName.DATASETS}/${newId}`
                );
            });
        } else {
            // todo: To be implemented as part of the edit task
            const updatePayload = {
                ...omit(dataset, ["versions"]),
                metadata: {
                    ...dataset?.versions[0].metadata,
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
                    level={get(dataset, "versions[0].metadata.metadata")}
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
                    {isDuplicate
                        ? t("components.EditDataset.duplicateButton")
                        : t("components.EditDataset.editButton")}
                </Button>
            </Paper>
        </Form>
    );
};

export default EditDataset;
