"use client";

import { useCallback, useMemo, useState } from "react";
import { Control, useForm } from "react-hook-form";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { DarTemplate } from "@/interfaces/DataAccessRequest";
import { UploadedFileMetadata } from "@/interfaces/FileUpload";
import {
    QuestionBankCreateUpdateQuestion,
    QuestionBankQuestionForm,
} from "@/interfaces/QuestionBankQuestion";
import Box from "@/components/Box";
import Button from "@/components/Button";
import Container from "@/components/Container";
import Form from "@/components/Form";
import InputWrapper from "@/components/InputWrapper";
import Paper from "@/components/Paper";
import Sections from "@/components/Sections";
import Tabs from "@/components/Tabs";
import Typography from "@/components/Typography";
import useAuth from "@/hooks/useAuth";
import useGet from "@/hooks/useGet";
import usePatch from "@/hooks/usePatch";
import usePost from "@/hooks/usePost";
import apis from "@/config/apis";
import { inputComponents } from "@/config/forms";
import theme, { colors } from "@/config/theme";
import { ArrowBackIosNewIcon } from "@/consts/icons";
import { RouteName } from "@/consts/routeName";
import { formatDarQuestion } from "@/utils/dataAccessRequest";
import { renderFormHydrationField } from "@/utils/formHydration";

const EDIT_TEMPLATE_TRANSLATION_PATH = "pages.account.team.dar.template.edit";

interface EditTemplateProps {
    teamId: string;
    darTemplateData?: DarTemplate;
    templateId: string;
}
const sections = [
    {
        id: 1,
        name: "File-based template",
        parent_section: null,
        order: 0,
    },
];

const PreviewContent = ({
    control,
    getValues,
}: {
    control: Control;
    getValues: () => unknown;
}) => {
    const question = getValues();
    if (!question) return null;

    const formattedQuestion = question.title && formatDarQuestion(question);

    if (!formattedQuestion) return null;

    return (
        <>
            {renderFormHydrationField(
                { ...formattedQuestion, disabled: true },
                control
            )}
        </>
    );
};

const sectionId = 1;

const EditDocumentTemplate = ({
    darTemplateData,
    teamId,
    templateId,
}: EditTemplateProps) => {
    const t = useTranslations(EDIT_TEMPLATE_TRANSLATION_PATH);
    const { user } = useAuth();
    const router = useRouter();

    const { data: templateData } = useGet<DarTemplate>(
        `${apis.dataAccessTemplateV1Url}/${templateId}`,
        {
            keepPreviousData: true,
            fallbackData: darTemplateData,
            revalidateOnMount: false,
        }
    );

    const backHref = `/${RouteName.ACCOUNT}/${RouteName.TEAM}/${teamId}/${RouteName.DATA_ACCESS_REQUESTS}/${RouteName.DAR_TEMPLATES}/${RouteName.LIST}`;

    const [documentExchangeQuestionId, setDocumentExchangeQuestionId] =
        useState<number | string | undefined>(
            templateData?.questions.find(q => q.section_id === 1)?.question_id
        );

    const documentExchangeQuestion = useMemo(
        () =>
            templateData?.questions.find(
                q => q.question_id === documentExchangeQuestionId
            )?.latest_version?.question_json,
        [templateData, documentExchangeQuestionId]
    );

    const updateTemplateQuestions = usePatch(apis.dataAccessTemplateV1Url, {
        itemName: "Update Template",
        query: `section_id=${sectionId}`,
    });

    const createQuestion = usePost<QuestionBankCreateUpdateQuestion>(
        `${apis.questionBankV1Url}`,
        {
            successNotificationsOn: false,
        }
    );

    const updateQuestion = usePatch<QuestionBankCreateUpdateQuestion>(
        `${apis.questionBankV1Url}`,
        {
            successNotificationsOn: false,
        }
    );

    const { control, handleSubmit, setValue, getValues } =
        useForm<QuestionBankQuestionForm>({
            defaultValues: {
                section_id: 1,
                required: true,
                validations: {},
                options: [],
                all_custodians: true,
                allow_guidance_override: true,
                component: "DocumentExchange",
                default: true,
                force_required: false,
                title: documentExchangeQuestion?.title ?? "",
                guidance: documentExchangeQuestion?.guidance ?? "",
                document: documentExchangeQuestion?.field?.document,
            },
        });

    const handleSaveChanges = useCallback(
        async (formData: QuestionBankQuestionForm, isPublished: boolean) => {
            let temporaryDocumentQuestionId;

            if (!documentExchangeQuestionId) {
                const res = await createQuestion(formData);
                setDocumentExchangeQuestionId(res);
                temporaryDocumentQuestionId = res;
            } else {
                await updateQuestion(documentExchangeQuestionId, formData);
            }

            const updatedQuestion = {
                id: temporaryDocumentQuestionId ?? documentExchangeQuestionId,
                guidance: getValues("guidance"),
            };

            const payload = {
                team_id: teamId,
                user_id: user?.id.toString(),
                published: isPublished ? 1 : 0,
                locked: false,
                questions: [updatedQuestion],
            };

            await updateTemplateQuestions(templateId, payload);
        },
        [
            documentExchangeQuestionId,
            createQuestion,
            updateQuestion,
            updateTemplateQuestions,
            getValues,
            teamId,
            user?.id,
            templateId,
        ]
    );

    const formFields = [
        {
            label: "Template Form Name",
            info: "Fill in the title of the document you are requesting to be filled",
            name: "title",
            component: inputComponents.TextField,
            required: false,
            selectOnFocus: true,
        },
        {
            label: "Template Form Guidance",
            info: "Insert template guidance here",
            name: "guidance",
            component: inputComponents.TextArea,
            required: false,
            selectOnFocus: true,
        },
        {
            label: "Upload",
            info: "Upload your completed form as part of your application",
            name: "document",
            component: inputComponents.FileUpload,
            required: false,
            skipImageValidation: true,
            fileSelectButtonText: "Upload",
            apiPath: `${apis.fileUploadV1Url}?entity_flag=document-exchange-upload`,
            showClearButton: true,
            fileDownloadApiPath: apis.fileProcessedV1Url,
            onFileUploaded: async (response: UploadedFileMetadata) => {
                const newFile = {
                    filename: response.filename,
                    uuid: response.uuid,
                };

                setValue(
                    "document",
                    { value: newFile },
                    { shouldValidate: true }
                );
            },
            allowReuploading: true,
            hideUpload: false,
        },
    ];

    const tabsList = [
        {
            label: "Create",
            value: "create",
            content: (
                <Paper
                    sx={{
                        p: 2,
                    }}>
                    {formFields.map(field => (
                        <Box key={field.name} sx={{ p: 0 }}>
                            <InputWrapper
                                key={field.name}
                                control={control}
                                {...field}
                                name={field.name}
                                showClearButton={false}
                            />
                        </Box>
                    ))}
                </Paper>
            ),
        },
        {
            label: "Preview",
            value: "preview",
            content: (
                <Paper
                    sx={{
                        p: 2,
                    }}>
                    <PreviewContent control={control} getValues={getValues} />
                </Paper>
            ),
        },
    ];

    return (
        <Container
            maxWidth={false}
            sx={{ minHeight: "1000px", p: 0, m: 1, mx: 0, pt: 0, mt: 0 }}>
            <Form
                onSubmit={handleSubmit(data => handleSaveChanges(data, false))}>
                <Box
                    sx={{
                        position: "sticky",
                        top: 0,
                        zIndex: theme.zIndex.appBar,
                        bgcolor: colors.grey,
                        borderBottom: 1,
                        borderColor: "divider",
                        py: 4,
                    }}>
                    <Container
                        maxWidth={false}
                        sx={{
                            display: "flex",
                            justifyContent: "space-between",
                        }}>
                        <Typography variant="h2" sx={{ m: 0 }}>
                            {t("title")}
                        </Typography>
                        <Box sx={{ display: "flex", gap: 2 }}>
                            <Button
                                onClick={handleSubmit(data =>
                                    handleSaveChanges(data, false)
                                )}
                                color="secondary"
                                variant="outlined">
                                {t("saveDraft")}
                            </Button>
                            <Button
                                onClick={handleSubmit(data =>
                                    handleSaveChanges(data, true)
                                )}>
                                {t("save")}
                            </Button>
                        </Box>
                    </Container>
                </Box>

                <Container
                    maxWidth={false}
                    sx={{
                        display: "grid",
                        gridTemplateColumns: { tablet: "1fr 4fr" },
                        gap: 2,
                        pt: 2,
                    }}>
                    <Sections sectionId={sectionId} sections={sections} />

                    <Container maxWidth={false}>
                        <Paper sx={{ p: 2 }}>
                            <Button
                                onClick={() => router.push(backHref)}
                                variant="text"
                                startIcon={<ArrowBackIosNewIcon />}>
                                {t("backLinkText")}
                            </Button>
                        </Paper>

                        {tabsList && (
                            <Tabs
                                centered
                                tabs={tabsList}
                                tabBoxSx={{
                                    padding: 0,
                                    backgroundColor: "white",
                                }}
                                rootBoxSx={{ padding: 0 }}
                            />
                        )}
                    </Container>
                </Container>
            </Form>
        </Container>
    );
};

export default EditDocumentTemplate;
