"use client";

import { useEffect, useMemo, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useTranslations } from "next-intl";
import { useParams, useRouter } from "next/navigation";
import { FileUpload } from "@/interfaces/FileUpload";
import { Team, TeamForm } from "@/interfaces/Team";
import { User } from "@/interfaces/User";
import Box from "@/components/Box";
import Button from "@/components/Button";
import Form from "@/components/Form";
import FormInputWrapper from "@/components/FormInputWrapper";
import InputWrapper from "@/components/InputWrapper";
import Loading from "@/components/Loading";
import Paper from "@/components/Paper";
import Typography from "@/components/Typography";
import UploadFile from "@/components/UploadFile";
import useGet from "@/hooks/useGet";
import usePatch from "@/hooks/usePatch";
import usePost from "@/hooks/usePost";
import { useUnsavedChanges } from "@/hooks/useUnsavedChanges";
import apis from "@/config/apis";
import {
    questionBankField,
    teamDefaultValues,
    teamFormFields,
    teamValidationSchema,
} from "@/config/forms/team";
import { Routes } from "@/consts/routes";

const TRANSLATION_PATH_CREATE = "pages.account.profile.teams.create";
const TRANSLATION_PATH_EDIT = "pages.account.profile.teams.edit";
const TRANSLATION_PATH_COMMON = "common";

const CreateIntegrationForm = () => {
    const params = useParams<{
        teamId: string;
    }>();
    const t = useTranslations();
    const [fileNotUploaded, setFileNotUploaded] = useState(false);
    const [imageUploaded, setImageUploaded] = useState(false);
    const [file, setFile] = useState<File>();
    const [createdTeamId, setCreatedTeamId] = useState<string | undefined>(
        params?.teamId
    );
    const [fileToBeUploaded, setFileToBeUploaded] = useState<boolean>();

    const { push } = useRouter();

    const { data: existingTeamData, isLoading } = useGet<Team>(
        `${apis.teamsV1Url}/${params?.teamId}`,
        {
            shouldFetch: !!params?.teamId,
        }
    );

    const { data: users = [] } = useGet<User[]>(apis.usersV1Url);

    const methods = useForm<TeamForm>({
        mode: "onTouched",
        resolver: yupResolver(teamValidationSchema),
        defaultValues: {
            ...teamDefaultValues,
        },
    });

    const { control, handleSubmit, formState, reset, watch } = methods;

    useEffect(() => {
        if (!existingTeamData) {
            return;
        }

        const teamData = {
            ...existingTeamData,
            users: existingTeamData?.users?.map(user => user.id),
        };

        if (teamData.team_logo) {
            setImageUploaded(true);
        }

        reset(teamData);
    }, [reset, existingTeamData]);

    useUnsavedChanges({
        shouldConfirmLeave: formState.isDirty && !formState.isSubmitSuccessful,
    });

    const createTeam = usePost<TeamForm>(apis.teamsV1Url, {
        itemName: "Team",
    });

    const editTeam = usePatch<Partial<TeamForm>>(apis.teamsV1Url);

    const submitForm = async (formData: TeamForm) => {
        if (!params?.teamId) {
            await createTeam({
                ...teamDefaultValues,
                ...formData,
            }).then(async result => {
                if (typeof result === "number" && file) {
                    setCreatedTeamId(result as string);
                    setFileToBeUploaded(true);
                }
            });
        } else {
            await editTeam(params?.teamId, formData).then(async result => {
                if (typeof result === "number" && file) {
                    setFileToBeUploaded(true);
                }
            });
        }

        setTimeout(() => {
            push(Routes.ACCOUNT_TEAMS);
        });
    };
    const uploadFile = usePost(
        `${apis.fileUploadV1Url}?entity_flag=team-image&team_id=${createdTeamId}`,
        {
            successNotificationsOn: false,
        }
    );

    useEffect(() => {
        const handleFileUploaded = async (
            createdTeamId: string,
            file: File
        ) => {
            const formData = new FormData();
            formData.append("file", file);
            const uploadedFileStatus = (await uploadFile(formData).catch(() =>
                setFile(undefined)
            )) as FileUpload;
            const { file_location } = uploadedFileStatus;

            await editTeam(createdTeamId, {
                team_logo: file_location,
            });
        };

        if (file && fileToBeUploaded && createdTeamId) {
            handleFileUploaded(createdTeamId, file);
        }
    }, [createdTeamId, fileToBeUploaded, editTeam, file, uploadFile]);

    const is_question_bank = watch("is_question_bank");
    const questionBankLabel = is_question_bank
        ? t(`${TRANSLATION_PATH_COMMON}.enabled`)
        : t(`${TRANSLATION_PATH_COMMON}.disabled`);

    const hydratedFormFields = useMemo(
        () =>
            teamFormFields.map(field => {
                if (field.name === "users") {
                    return {
                        ...field,
                        options: users?.map(user => ({
                            value: user.id,
                            label: `${user.firstname} ${user.lastname}`,
                        })),
                    };
                }
                return field;
            }),
        [users]
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
                                checkedLabel={
                                    <>
                                        {t(
                                            `${TRANSLATION_PATH_COMMON}.questionBank`
                                        )}
                                        <Typography
                                            component="span"
                                            sx={{ fontWeight: "bold" }}>
                                            {" "}
                                            {questionBankLabel.toLowerCase()}
                                        </Typography>
                                    </>
                                }
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
                            <FormInputWrapper
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
                                error={
                                    fileNotUploaded
                                        ? {
                                              type: "",
                                              message: t(
                                                  `${TRANSLATION_PATH_CREATE}.aspectRatioError`
                                              ),
                                          }
                                        : undefined
                                }
                                formControlSx={{ width: "70%", p: 0 }}>
                                <UploadFile
                                    fileSelectButtonText={t(
                                        `${TRANSLATION_PATH_CREATE}.fileSelectButtonText`
                                    )}
                                    acceptedFileTypes=".jpg,.png"
                                    onBeforeUploadCheck={(
                                        height: number,
                                        width: number
                                    ) => {
                                        const aspectRatio =
                                            (width || 0) / (height || 0);
                                        return (
                                            aspectRatio <= 2.2 &&
                                            aspectRatio >= 1.8
                                        );
                                    }}
                                    onFileChange={(file: File) => {
                                        setFileNotUploaded(false);
                                        setFile(file);
                                    }}
                                    onFileCheckSucceeded={() => {
                                        setImageUploaded(true);
                                        setFileNotUploaded(false);
                                    }}
                                    onFileCheckFailed={() => {
                                        setFileNotUploaded(true);
                                    }}
                                    sx={{ py: 2 }}
                                    showUploadButton={false}
                                />
                            </FormInputWrapper>

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
                            onClick={() => reset(teamDefaultValues)}>
                            {t(`${TRANSLATION_PATH_COMMON}.cancel`)}
                        </Button>
                        <Button type="submit">
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

export default CreateIntegrationForm;
