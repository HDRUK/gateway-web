"use client";

import { useEffect, useMemo, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { Option } from "@/interfaces/Option";
import { Team } from "@/interfaces/Team";
import {
    DataCustodianNetworkFormValues,
    DataCustodianNetworkListItem,
} from "@/interfaces/DataCustodianNetwork";
import Box from "@/components/Box";
import Button from "@/components/Button";
import Form from "@/components/Form";
import InputWrapper from "@/components/InputWrapper";
import Loading from "@/components/Loading";
import Paper from "@/components/Paper";
import Typography from "@/components/Typography";
import useDebounce from "@/hooks/useDebounce";
import useGet from "@/hooks/useGet";
import usePost from "@/hooks/usePost";
import usePut from "@/hooks/usePut";
import apis from "@/config/apis";
import {
    dataCustodianNetworkDefaultValues,
    dataCustodianNetworkEnabledField,
    dataCustodianNetworkFormFields,
    dataCustodianNetworkTeamIdsField,
    dataCustodianNetworkValidationSchema,
} from "@/config/forms/dataCustodianNetwork";

interface DataCustodianNetworkFormProps {
    networkId?: number;
    onDone: () => void;
    onCancel: () => void;
}

const updateOptions = (prevOptions: Option[], newOptions: Option[]) => {
    const existingIds = prevOptions.map(option => option.value);
    const additions = newOptions.filter(
        option => !existingIds.includes(option.value)
    );

    if (additions.length === 0) {
        return prevOptions;
    }

    return [...prevOptions, ...additions].sort((a, b) =>
        a.label.localeCompare(b.label)
    );
};

export default function DataCustodianNetworkForm({
    networkId,
    onDone,
    onCancel,
}: DataCustodianNetworkFormProps) {
    const isEditing = !!networkId;
    const [isSaving, setIsSaving] = useState(false);
    const [searchName, setSearchName] = useState("");
    const [teamOptions, setTeamOptions] = useState<Option[]>([]);
    const searchNameDebounced = useDebounce(searchName, 500);

    const { data: existingNetwork, isLoading: isLoadingNetwork } =
        useGet<DataCustodianNetworkListItem>(
            isEditing
                ? `${apis.dataCustodianNetworkV2Url}/${networkId}`
                : null
        );

    const { data: searchedTeams = [], isLoading: isLoadingTeams } = useGet<
        Team[]
    >(`${apis.teamsSearchV1Url}?name=${searchNameDebounced}`, {
        shouldFetch: !!searchNameDebounced,
    });

    const methods = useForm<DataCustodianNetworkFormValues>({
        mode: "onTouched",
        resolver: yupResolver(dataCustodianNetworkValidationSchema),
        defaultValues: dataCustodianNetworkDefaultValues,
    });

    const { control, handleSubmit, reset } = methods;

    useEffect(() => {
        if (!existingNetwork) return;

        setTeamOptions(prevOptions =>
            updateOptions(
                prevOptions,
                (existingNetwork.teams ?? []).map(team => ({
                    value: team.id,
                    label: team.name,
                }))
            )
        );

        reset({
            name: existingNetwork.name,
            summary: existingNetwork.summary ?? "",
            enabled: existingNetwork.enabled,
            url: existingNetwork.url ?? "",
            service: Array.isArray(existingNetwork.service)
                ? existingNetwork.service.join(",")
                : existingNetwork.service ?? "",
            img_url: existingNetwork.img_url ?? "",
            team_ids: (existingNetwork.teams ?? []).map(team => team.id),
        });
    }, [existingNetwork, reset]);

    useEffect(() => {
        setTeamOptions(prevOptions =>
            updateOptions(
                prevOptions,
                searchedTeams.map(team => ({
                    value: team.id,
                    label: team.name,
                }))
            )
        );
    }, [searchedTeams]);

    const createNetwork = usePost<DataCustodianNetworkFormValues>(
        apis.dataCustodianNetworkV2Url,
        { itemName: "Data Custodian Network" }
    );

    const editNetwork = usePut<DataCustodianNetworkFormValues>(
        apis.dataCustodianNetworkV2Url,
        { itemName: "Data Custodian Network" }
    );

    const submitForm = async (formData: DataCustodianNetworkFormValues) => {
        if (isSaving) return;

        setIsSaving(true);

        const result = isEditing
            ? await editNetwork(networkId as number, formData)
            : await createNetwork(formData);

        setIsSaving(false);

        if (result) {
            onDone();
        }
    };

    const hydratedTeamIdsField = useMemo(
        () => ({
            ...dataCustodianNetworkTeamIdsField,
            options: teamOptions,
            isLoadingOptions: isLoadingTeams,
            onInputChange: (e: React.ChangeEvent, value: string) => {
                setSearchName(value);
            },
        }),
        [teamOptions, isLoadingTeams]
    );

    if (isEditing && isLoadingNetwork) {
        return <Loading />;
    }

    return (
        <FormProvider {...methods}>
            <Form onSubmit={handleSubmit(submitForm)}>
                <Paper sx={{ mb: 1 }}>
                    <Box
                        display="flex"
                        sx={{
                            alignItems: "center",
                            justifyContent: "space-between",
                        }}>
                        <Typography variant="h3">
                            {isEditing
                                ? "Edit Data Custodian Network"
                                : "Create Data Custodian Network"}
                        </Typography>
                        <InputWrapper
                            control={control}
                            {...dataCustodianNetworkEnabledField}
                            label="Enabled"
                            formControlSx={{ mb: 0 }}
                        />
                    </Box>
                </Paper>
                <Paper sx={{ mb: 1 }}>
                    <Box padding={0}>
                        {dataCustodianNetworkFormFields.map(field => (
                            <InputWrapper
                                key={field.name}
                                control={control}
                                {...field}
                            />
                        ))}
                        <InputWrapper
                            control={control}
                            {...hydratedTeamIdsField}
                        />
                    </Box>
                </Paper>
                <Paper>
                    <Box
                        padding={0}
                        display="flex"
                        justifyContent="space-between">
                        <Button
                            color="secondary"
                            variant="outlined"
                            onClick={onCancel}
                            disabled={isSaving}>
                            Cancel
                        </Button>
                        <Button type="submit" disabled={isSaving}>
                            {isEditing ? "Save changes" : "Create network"}
                        </Button>
                    </Box>
                </Paper>
            </Form>
        </FormProvider>
    );
}
