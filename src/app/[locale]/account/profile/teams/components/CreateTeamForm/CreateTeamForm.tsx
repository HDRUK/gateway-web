"use client";

import { useEffect, useMemo, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useTranslations } from "next-intl";
import { useParams, useRouter } from "next/navigation";
import { Alias } from "@/interfaces/Alias";
import { Option } from "@/interfaces/Option";
import { Team, TeamEditForm, TeamCreateForm } from "@/interfaces/Team";
import { User } from "@/interfaces/User";
import { OptionsType } from "@/components/Autocomplete/Autocomplete";
import Box from "@/components/Box";
import Button from "@/components/Button";
import Form from "@/components/Form";
import InputWrapper from "@/components/InputWrapper";
import Loading from "@/components/Loading";
import Paper from "@/components/Paper";
import Typography from "@/components/Typography";
import UploadFile from "@/components/UploadFile";
import useDebounce from "@/hooks/useDebounce";
import useGet from "@/hooks/useGet";
import usePatch from "@/hooks/usePatch";
import usePost from "@/hooks/usePost";
import { useUnsavedChanges } from "@/hooks/useUnsavedChanges";
import notificationService from "@/services/notification";
import apis from "@/config/apis";
import {
    questionBankField,
    teamDefaultValues,
    teamCreateDefaultValues,
    teamFormFields,
    teamValidationSchema,
} from "@/config/forms/team";
import { ROLE_CUSTODIAN_TEAM_ADMIN } from "@/consts/roles";
import { Routes } from "@/consts/routes";

const TRANSLATION_PATH_CREATE = "pages.account.profile.teams.create";
const TRANSLATION_PATH_EDIT = "pages.account.profile.teams.edit";
const TRANSLATION_PATH_COMMON = "common";

const CreateTeamForm = () => {
    const params = useParams<{
        teamId: string;
    }>();
    const t = useTranslations();
    const [imageUploaded, setImageUploaded] = useState(false);
    const [file, setFile] = useState<File>();
    const [createdTeamId, setCreatedTeamId] = useState<string | undefined>(
        params?.teamId
    );
    const [fileToBeUploaded, setFileToBeUploaded] = useState<boolean>();

    const [isSaving, setIsSaving] = useState<boolean>();
    const [triggerFileUpload, setTriggerFileUpload] = useState<boolean>();

    const [searchName, setSearchName] = useState("");
    const [userOptions, setUserOptions] = useState<Option[]>([]);
    const searchNameDebounced = useDebounce(searchName, 500);

    const { push } = useRouter();

    const { data: existingTeamData, isLoading } = useGet<Team>(
        `${apis.teamsV1Url}/${params?.teamId}`,
        {
            shouldFetch: !!params?.teamId,
        }
    );

    const teamAdmins = useMemo(
        () =>
            existingTeamData?.users.filter(user =>
                user.roles
                    .map(role => role.name)
                    .includes(ROLE_CUSTODIAN_TEAM_ADMIN)
            ) || [],
        [existingTeamData]
    );

    const { data: users = [], isLoading: isLoadingUsers } = useGet<User[]>(
        `${apis.usersV1Url}?filterNames=${searchNameDebounced}`,
        {
            shouldFetch: !!searchNameDebounced,
        }
    );

    const {
        data: aliasesData = [],
        isLoading: isLoadingAliases,
        mutate: mutateAliases,
    } = useGet<Alias[]>(`${apis.aliasesV1Url}?per_page=-1`);

    const addAlias = usePost<Alias>(apis.aliasesV1Url, {
        successNotificationsOn: false,
        errorNotificationsOn: false,
    });

    const methods = useForm<TeamEditForm | TeamCreateForm>({
        mode: "onTouched",
        resolver: yupResolver(teamValidationSchema),
        defaultValues: {
            ...teamDefaultValues,
        },
    });

    const { control, handleSubmit, formState, reset, watch, getValues } =
        methods;

    const updateUserOptions = (
        prevOptions: Option[],
        userOptions: Option[]
    ) => {
        const existingUserIds = prevOptions.map(option => option.value);
        const newOptions = userOptions?.filter(
            option => !existingUserIds.includes(option.value)
        );
        if (newOptions && newOptions.length > 0) {
            return [...prevOptions, ...newOptions].sort((a, b) =>
                a.label.localeCompare(b.label)
            );
        }
        return prevOptions;
    };

    useEffect(() => {
        const userOptions = teamAdmins.map(user => ({
            value: user.id,
            label: `${user.name} (${user.email})`,
        }));

        setUserOptions(prevOptions =>
            updateUserOptions(prevOptions, userOptions)
        );
    }, [teamAdmins]);

    useEffect(() => {
        const userOptions = users.map(user => ({
            value: user.id,
            label: `${user.name} (${user.email})`,
        }));

        setUserOptions(prevOptions =>
            updateUserOptions(prevOptions, userOptions)
        );
    }, [users]);

    const selectedUsers = watch("users");

    useEffect(() => {
        if (selectedUsers) {
            setUserOptions(prevOptions => {
                return prevOptions.filter(option =>
                    selectedUsers.includes(option.value as number)
                );
            });
        }
    }, [selectedUsers]);

    useEffect(() => {
        if (!existingTeamData) {
            return;
        }
        const {
            name,
            introduction,
            member_of,
            contact_point,
            is_question_bank,
            team_logo,
            dar_modal_content,
            url,
            service,
            aliases,
        } = existingTeamData;

        const teamData = {
            name,
            introduction,
            member_of,
            is_question_bank,
            users: teamAdmins.map(user => user.id),
            contact_point: contact_point ?? "",
            dar_modal_content,
            url,
            service,
            aliases: aliases?.map(alias => alias.id),
        };

        if (team_logo) {
            setImageUploaded(true);
        }

        reset(teamData);
    }, [reset, existingTeamData, teamAdmins]);

    useUnsavedChanges({
        shouldConfirmLeave: formState.isDirty && !formState.isSubmitSuccessful,
    });

    const createTeam = usePost<TeamCreateForm>(apis.teamsV1Url, {
        itemName: "Team",
        successNotificationsOn: !file,
    });

    const editTeam = usePatch<Partial<TeamEditForm>>(apis.teamsV1Url, {
        itemName: "Team",
    });

    const saveAliases = async (formData: TeamCreateForm | TeamEditForm) => {
        const newAliasNames = formData.aliases.filter(
            alias => typeof alias === "string"
        ) as string[];

        // Create new aliases (POST requests)
        const result = await Promise.all(
            newAliasNames.map(name => addAlias({ name }))
        );

        // Throw on failure to save alias
        if (!result || (Array.isArray(result) && result[0] === null)) {
            throw new Error(`Failed to create Aliases`);
        }

        // Refetch alias list
        const updatedAliases = await mutateAliases();

        // Rebuild formData.aliases as full alias objects
        return formData.aliases.map(alias => {
            if (typeof alias === "string") {
                return updatedAliases?.find(a => a.name === alias)?.id ?? alias;
            }
            return alias;
        });
    };

    const submitForm = async (formData: TeamCreateForm | TeamEditForm) => {
        if (isSaving) {
            return;
        }

        setIsSaving(true);

        try {
            const updatedAliases = await saveAliases(formData);

            const formattedFormData = {
                ...formData,
                aliases: updatedAliases,
            };

            const isCreatingTeam = !params?.teamId;
            let result;

            if (isCreatingTeam) {
                result = await createTeam({
                    ...teamCreateDefaultValues,
                    ...formattedFormData,
                });

                if (result) {
                    if (typeof result === "number" && file) {
                        setCreatedTeamId(result as string);
                        setFileToBeUploaded(true);
                    } else {
                        push(Routes.ACCOUNT_TEAMS);
                    }
                } else {
                    setIsSaving(false);
                }
            } else if (file) {
                setFileToBeUploaded(true);
            } else {
                result = await editTeam(params.teamId, formattedFormData);
                if (result) {
                    push(Routes.ACCOUNT_TEAMS);
                } else {
                    setIsSaving(false);
                }
            }
        } catch (error) {
            notificationService.apiError("Failed to save team");
            setIsSaving(false);
        }
    };

    useEffect(() => {
        if (file && fileToBeUploaded && createdTeamId) {
            setTriggerFileUpload(true);
        }
    }, [createdTeamId, fileToBeUploaded, editTeam, file]);

    const is_question_bank = watch("is_question_bank");
    const questionBankLabel = is_question_bank
        ? t(`${TRANSLATION_PATH_COMMON}.enabled`)
        : t(`${TRANSLATION_PATH_COMMON}.disabled`);

    const handleOnUserInputChange = (e: React.ChangeEvent, value: string) => {
        if (value === "") {
            setSearchName(value);
            return;
        }
        if (e?.type !== "change") {
            return;
        }
        setSearchName(value);
    };

    const aliasOptions = useMemo(() => {
        if (!aliasesData) return [];

        return aliasesData.map(data => {
            return {
                label: data.name,
                value: data.id,
            };
        }) as OptionsType[];
    }, [aliasesData]);

    const getOptions = (field: string) => {
        if (field === "aliases") {
            return aliasOptions;
        }
        return userOptions;
    };

    const hydratedFormFields = useMemo(
        () =>
            teamFormFields.map(field => {
                if (field.name === "users") {
                    return {
                        ...field,
                        onInputChange: handleOnUserInputChange,
                        isLoadingOptions: isLoadingUsers,
                        options: userOptions,
                    };
                }
                if (field.name === "aliases") {
                    return {
                        ...field,
                        options: getOptions("aliases"),
                        isLoadingOptions: isLoadingAliases,
                        chipColor: "alias",
                    };
                }

                return field;
            }),
        [isLoadingUsers, userOptions, getOptions, isLoadingAliases]
    );

    if (isLoading) {
        return <Loading />;
    }

    return (
        <FormProvider {...methods}>
            <Form sx={{ maxWidth: 1000 }} onSubmit={handleSubmit(submitForm)}>
                <Paper sx={{ marginBottom: 1 }}>
                    <Box
                        display="flex"
                        sx={{
                            alignItems: "center",
                            justifyContent: "space-between",
                        }}>
                        <div>
                            <Typography variant="h2">
                                {params?.teamId
                                    ? t(`${TRANSLATION_PATH_EDIT}.title`)
                                    : t(`${TRANSLATION_PATH_CREATE}.title`)}
                            </Typography>
                            <Typography>
                                {params?.teamId
                                    ? t(`${TRANSLATION_PATH_EDIT}.text`)
                                    : t(`${TRANSLATION_PATH_CREATE}.text`)}
                            </Typography>
                        </div>
                        <Box>
                            <InputWrapper
                                control={control}
                                {...questionBankField}
                                label={t(
                                    `${TRANSLATION_PATH_COMMON}.questionBank`
                                )}
                                extraInfo={questionBankLabel}
                                formControlSx={{ mb: 0 }}
                            />
                        </Box>
                    </Box>
                </Paper>
                <Paper sx={{ marginBottom: 1, gridColumn: "span 2" }}>
                    <Box padding={0}>
                        {hydratedFormFields.map(field => (
                            <InputWrapper
                                key={field.name}
                                control={control}
                                {...field}
                            />
                        ))}
                        <Box
                            sx={{
                                display: "flex",
                                p: 0,
                                gap: 4,
                            }}>
                            <UploadFile
                                apiPath={`${apis.fileUploadV1Url}?entity_flag=teams-media&team_id=${createdTeamId}`}
                                fileSelectButtonText={t(
                                    `${TRANSLATION_PATH_CREATE}.fileSelectButtonText`
                                )}
                                acceptedFileTypes=".jpg,.png"
                                onFileChange={(file: File) => {
                                    setFile(file);
                                }}
                                onFileCheckSucceeded={() => {
                                    setImageUploaded(true);
                                }}
                                onFileUploaded={async response => {
                                    if (!createdTeamId) {
                                        return;
                                    }

                                    await editTeam(createdTeamId, {
                                        ...getValues(),
                                        team_logo: response?.file_location,
                                    });

                                    push(Routes.ACCOUNT_TEAMS);
                                }}
                                onFileUploadError={() => {
                                    setFileToBeUploaded(false);
                                    setTriggerFileUpload(false);
                                    setFile(undefined);
                                    setIsSaving(false);
                                }}
                                sx={{ width: "70%", p: 0, py: 2 }}
                                showUploadButton={false}
                                triggerFileUpload={triggerFileUpload}
                                label="Logo"
                                info={
                                    imageUploaded
                                        ? t(
                                              `${TRANSLATION_PATH_CREATE}.addImageSuccess`
                                          )
                                        : t(
                                              `${TRANSLATION_PATH_CREATE}.aspectRatioInfo`
                                          )
                                }
                            />

                            {existingTeamData?.team_logo && (
                                <Box sx={{ width: "30%" }}>
                                    <img
                                        src={existingTeamData?.team_logo}
                                        alt={`${existingTeamData?.name} logo`}
                                        width="100%"
                                    />
                                </Box>
                            )}
                        </Box>
                    </Box>
                </Paper>
                <Paper>
                    <Box
                        padding={0}
                        display="flex"
                        justifyContent="space-between"
                        marginBottom={10}>
                        <Button
                            color="secondary"
                            variant="outlined"
                            onClick={() => push(Routes.ACCOUNT_TEAMS)}
                            disabled={isSaving}>
                            {t(`${TRANSLATION_PATH_COMMON}.cancel`)}
                        </Button>
                        <Button type="submit" disabled={isSaving}>
                            {t(
                                `${TRANSLATION_PATH_COMMON}.${
                                    params?.teamId ? "update" : "publish"
                                }`
                            )}
                        </Button>
                    </Box>
                </Paper>
            </Form>
        </FormProvider>
    );
};

export default CreateTeamForm;
