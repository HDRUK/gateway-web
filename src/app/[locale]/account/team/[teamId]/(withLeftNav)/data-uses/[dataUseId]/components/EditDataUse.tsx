"use client";

import { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { Typography } from "@mui/material";
import dayjs from "dayjs";
import { isEqual } from "lodash";
import { useTranslations } from "next-intl";
import { useParams, useRouter } from "next/navigation";
import { DataUse, DatasetWithTitle } from "@/interfaces/DataUse";
import { Keyword } from "@/interfaces/Keyword";
import Accordion from "@/components/Accordion";
import Box from "@/components/Box";
import Button from "@/components/Button";
import Form from "@/components/Form";
import InputWrapper from "@/components/InputWrapper";
import useGet from "@/hooks/useGet";
import usePut from "@/hooks/usePut";
import apis from "@/config/apis";
import { inputComponents } from "@/config/forms";
import {
    dataUseDefaultValues,
    dataUseFormFields,
    dataUseValidationSchema,
} from "@/config/forms/dataUse";
import { colors } from "@/config/theme";
import { RouteName } from "@/consts/routeName";
import {
    ACCOUNT,
    COMPONENTS,
    DATASETS,
    PAGES,
    TEAM,
} from "@/consts/translation";

const EditDataUse = () => {
    const t = useTranslations(
        `${PAGES}.${ACCOUNT}.${TEAM}.${DATASETS}.${COMPONENTS}.EditDataUse`
    );

    const params = useParams<{
        teamId: string;
        dataUseId: string;
    }>();
    const { push } = useRouter();

    const { data: keywords } = useGet<Keyword[]>(
        `${apis.keywordsV1Url}?perPage=200`
    );

    const { data } = useGet<DataUse[]>(
        `${apis.dataUseV1Url}/${params?.dataUseId}`
    );

    const existingDataUse = useMemo(() => data?.[0], [data]);

    const mapKeywords = (keywords: Keyword[]) =>
        keywords.map(keyword => keyword.name);

    const mapDatasets = (datasets: DatasetWithTitle[]) =>
        datasets.flatMap(dataset => dataset.shortTitle);

    const { control, handleSubmit, reset } = useForm<DataUse>({
        mode: "onTouched",
        resolver: yupResolver(dataUseValidationSchema),
        defaultValues: dataUseDefaultValues,
    });

    useEffect(() => {
        if (!existingDataUse) {
            return;
        }

        const formData = {
            ...existingDataUse,
            project_start_date: existingDataUse?.project_start_date
                ? dayjs(existingDataUse.project_start_date)
                : null,
            project_end_date: existingDataUse?.project_end_date
                ? dayjs(existingDataUse.project_end_date)
                : null,
            latest_approval_date: existingDataUse?.latest_approval_date
                ? dayjs(existingDataUse.latest_approval_date)
                : null,
            access_date: existingDataUse?.access_date
                ? dayjs(existingDataUse.access_date)
                : null,
            keywords: existingDataUse?.keywords
                ? mapKeywords(existingDataUse.keywords as Keyword[])
                : [],
            datasets: existingDataUse?.datasets
                ? mapDatasets(existingDataUse.datasets as DatasetWithTitle[])
                : [],
        };
        reset(formData);
    }, [reset, existingDataUse]);

    const editDataUse = usePut<Partial<DataUse>>(`${apis.dataUseV1Url}`, {
        itemName: "Application",
    });

    const getChangedFields = <T extends DataUse>(
        original: T,
        updated: T
    ): Partial<T> => {
        return Object.keys(original).reduce((changes, key) => {
            if (!isEqual(original[key as keyof T], updated[key as keyof T])) {
                return {
                    ...changes,
                    [key]: updated[key as keyof T],
                };
            }
            return changes;
        }, {} as Partial<T>);
    };

    const submitForm = async (formData: DataUse) => {
        if (!existingDataUse) {
            return;
        }
        const edited = {
            ...formData,
            project_start_date: formData.project_start_date
                ? dayjs(formData.project_start_date).format(
                      "YYYY-MM-DDThh:mm:ss"
                  )
                : null,
            project_end_date: formData.project_end_date
                ? dayjs(formData.project_end_date).format("YYYY-MM-DDThh:mm:ss")
                : null,
            latest_approval_date: formData.latest_approval_date
                ? dayjs(formData.latest_approval_date).format(
                      "YYYY-MM-DDThh:mm:ss"
                  )
                : null,
            access_date: formData.access_date
                ? dayjs(formData.access_date).format("YYYY-MM-DDThh:mm:ss")
                : null,
            datasets: existingDataUse?.datasets,
        };

        const formUpdates: Partial<DataUse> = getChangedFields(
            existingDataUse,
            edited
        );

        const response = await editDataUse(params!.dataUseId, formUpdates);

        if (response) {
            push(
                `/${RouteName.ACCOUNT}/${RouteName.TEAM}/${params?.teamId}/${RouteName.DATA_USES}`
            );
        }
    };

    const handleCancel = () => {
        push(
            `/${RouteName.ACCOUNT}/${RouteName.TEAM}/${params?.teamId}/${RouteName.DATA_USES}`
        );
    };

    const [keywordOptions, setKeywordsOptions] = useState<string[]>([]);

    useEffect(() => {
        if (!keywords) {
            return;
        }

        setKeywordsOptions(keywords.map(keyword => keyword.name));
    }, [keywords]);

    return (
        <Form onSubmit={handleSubmit(submitForm)}>
            <Box>
                {dataUseFormFields.map(section => {
                    return (
                        <Accordion
                            key={section.sectionName}
                            sx={{
                                ".MuiAccordionSummary-root": {
                                    background: colors.purple400,
                                    color: colors.white,
                                },
                                ".MuiSvgIcon-root.MuiSvgIcon-colorPrimary": {
                                    color: colors.white,
                                },
                            }}
                            heading={
                                <Typography variant="h4" sx={{ m: 0 }}>
                                    {section.sectionName}
                                </Typography>
                            }
                            contents={section.fields.map(field => (
                                <Box
                                    sx={{
                                        p: 0,
                                        gridColumn: "span 3",
                                    }}>
                                    <InputWrapper
                                        key={field.name}
                                        control={control}
                                        {...field}
                                        {...(field.component ===
                                            inputComponents.Autocomplete && {
                                            options:
                                                field.name === "keywords"
                                                    ? keywordOptions
                                                    : [],
                                        })}
                                    />
                                </Box>
                            ))}
                        />
                    );
                })}
            </Box>

            <Box
                sx={{
                    display: "flex",
                    justifyContent: "flex-end",
                    gap: 2,
                }}>
                <Button type="submit">{t("submit")}</Button>
                <Button variant="text" onClick={handleCancel}>
                    {t("cancel")}
                </Button>
            </Box>
        </Form>
    );
};

export default EditDataUse;
