"use client";

import { Fragment, useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { Divider } from "@mui/material";
import { isEmpty } from "lodash";
import { useTranslations } from "next-intl";
import { useParams, useSearchParams } from "next/navigation";
import {
    DarApplication,
    DarApplicationAnswer,
    DarApplicationResponses,
    DarFormattedField,
} from "@/interfaces/DataAccessRequest";
import { DarReviewsResponse } from "@/interfaces/DataAccessReview";
import { FileUploadFields } from "@/interfaces/FileUpload";
import { QuestionBankSection } from "@/interfaces/QuestionBankSection";
import Box from "@/components/Box";
import BoxContainer from "@/components/BoxContainer";
import Button from "@/components/Button";
import DarMessages from "@/components/DarMessages";
import InputWrapper from "@/components/InputWrapper";
import Link from "@/components/Link";
import Loading from "@/components/Loading";
import { MarkDownSanitizedWithHtml } from "@/components/MarkDownSanitizedWithHTML";
import Paper from "@/components/Paper";
import Sections from "@/components/Sections";
import Typography from "@/components/Typography";
import useAuth from "@/hooks/useAuth";
import useDelete from "@/hooks/useDelete";
import useGet from "@/hooks/useGet";
import usePut from "@/hooks/usePut";
import apis from "@/config/apis";
import { inputComponents } from "@/config/forms";
import {
    beforeYouBeginFormFields,
    darApplicationValidationSchema,
    excludedQuestionFields,
    generateYupSchema,
    messageSection,
} from "@/config/forms/dataAccessApplication";
import theme, { colors } from "@/config/theme";
import {
    DarApplicationApprovalStatus,
    DarApplicationStatus,
} from "@/consts/dataAccess";
import { ArrowBackIosNewIcon } from "@/consts/icons";
import { RouteName } from "@/consts/routeName";
import {
    createFileUploadConfig,
    formatDarQuestion,
    getVisibleQuestionIds,
    mapKeysToValues,
} from "@/utils/dataAccessRequest";
import {
    isFirstSection,
    renderFormHydrationField,
} from "@/utils/formHydration";
import DarFormBanner from "./DarFormBanner";

const TRANSLATION_PATH = "pages.account.team.dar.application.create";
const PROJECT_TITLE_FIELD = "project_title";
const ERROR_TYPE_REQUIRED = ["required", "optionality"];

interface ApplicationSectionProps {
    applicationId: number;
    data: DarApplication;
    userAnswers: DarApplicationAnswer[];
    sections: QuestionBankSection[];
}

const ApplicationSection = ({
    applicationId,
    data,
    userAnswers,
    sections,
}: ApplicationSectionProps) => {
    const t = useTranslations(TRANSLATION_PATH);
    const { user } = useAuth();

    const darApplicationEndpoint = `${apis.usersV1Url}/${user?.id}/dar/applications/${applicationId}`;

    const [selectedField, setSelectedField] = useState<string>();
    const [lastSavedDate, setLastSavedDate] = useState<Date>();
    const [guidanceText, setGuidanceText] = useState<string>();
    const [sectionId, setSectionId] = useState<number | undefined>(undefined);

    const handleChangeSection = (sectionId: number) => {
        setSectionId(sectionId);
    };

    const updateAnswers = usePut(darApplicationEndpoint, {
        itemName: "Data Access Request",
    });

    const removeUploadedFile = useDelete(`${darApplicationEndpoint}/files`, {
        itemName: "File",
    });

    const getSection = (id: number) => sections?.find(s => s.id === id);
    const getParentSection = (id: number) => getSection(id)?.parent_section;

    const questions = data?.questions;

    const formatGuidance = (guidance: string) =>
        guidance.replace(/\\n\\n/g, "\n\n");

    const defaultValues = Object.fromEntries(
        userAnswers?.map(a => [a.question_id, a.answer])
    );

    const { control, handleSubmit, getValues, watch, formState, setValue } =
        useForm<DarApplicationResponses>({
            defaultValues: {
                ...defaultValues,
                project_title: data.project_title,
            },
            resolver: yupResolver(
                darApplicationValidationSchema.concat(
                    generateYupSchema(data.questions)
                )
            ),
        });

    const projectTitle = watch(PROJECT_TITLE_FIELD);

    const updateGuidanceText = (fieldName: string) => {
        setSelectedField(fieldName);

        const guidance = questions?.find(
            question => question.title === fieldName
        )?.guidance;

        if (!guidance) {
            return;
        }

        const parsedGuidance = new DOMParser().parseFromString(
            formatGuidance(guidance),
            "text/html"
        );
        if (parsedGuidance.documentElement.textContent) {
            setGuidanceText(parsedGuidance.documentElement.innerHTML);
        }
    };

    const filteredData = useMemo(() => {
        return (
            questions
                ?.filter(field => !field.is_child)
                .map(field => formatDarQuestion(field)) || []
        );
    }, [questions, sectionId, getParentSection]);

    const parentFieldNames = useMemo(
        () =>
            questions
                ?.filter(f => f.is_child === 0)
                .map(f => f.question_id.toString()) || [],
        [questions]
    );

    const parentValuesArray = watch(parentFieldNames);

    const parentValues = useMemo(
        () => mapKeysToValues(parentFieldNames, parentValuesArray),
        [parentFieldNames, parentValuesArray]
    );

    const visibleQuestionIds = useMemo(
        () =>
            getVisibleQuestionIds(
                filteredData,
                parentValues,
                excludedQuestionFields
            ),
        [filteredData, parentValues]
    );

    const saveApplication = async (formData?: DarApplicationResponses) => {
        const applicationData = {
            project_title: formData
                ? formData[PROJECT_TITLE_FIELD]
                : getValues(PROJECT_TITLE_FIELD),
            applicant_id: data.applicant_id,
            submission_status: formData
                ? DarApplicationStatus.SUBMITTED
                : DarApplicationStatus.DRAFT,
        };

        const answers = Object.entries(formData ?? getValues())
            .map(([key, val]) => ({
                question_id: key,
                answer: val,
            }))
            .filter(
                a =>
                    !isEmpty(a.answer) &&
                    !excludedQuestionFields.includes(a.question_id) &&
                    visibleQuestionIds?.includes(a.question_id)
            );

        const saveResponse = await updateAnswers("", {
            ...applicationData,
            answers,
        });

        if (saveResponse) {
            setLastSavedDate(new Date());
        }
    };

    const handleSave = async (formData: DarApplicationResponses) => {
        await saveApplication(formData);
    };

    const handleSaveAsDraft = async () => {
        await saveApplication();
    };

    const processedSections = new Set();

    const renderSectionHeader = (field: DarFormattedField) => (
        <>
            <Box>
                <Typography variant="h3">
                    {getSection(field.section_id)?.name}
                </Typography>
            </Box>
            <Divider variant="fullWidth" sx={{ mb: 4 }} />
        </>
    );

    const params = useParams<{
        applicationId: string;
        teamId?: string;
    }>();

    const searchParams = useSearchParams();
    const teamId = searchParams?.get("teamId");

    const isResearcher = !params?.teamId;

    const {
        data: reviews,
        mutate: mutateReviews,
        isLoading: loadingReviews,
    } = useGet<DarReviewsResponse[]>(
        isResearcher
            ? `${apis.usersV1Url}/${user?.id}/dar/applications/${applicationId}/reviews`
            : `${apis.teamsV1Url}/${teamId}/dar/applications/${applicationId}/reviews`,
        { keepPreviousData: true, errorNotificationsOn: false }
    );

    const parentSections = useMemo(() => {
        const filteredSections =
            sections?.filter(s => s.parent_section === null) || [];

        return (isResearcher && reviews?.length) || !isResearcher
            ? [...filteredSections, messageSection]
            : filteredSections;
    }, [sections, isResearcher, reviews]);

    const currentSectionIndex = sectionId
        ? parentSections.findIndex(section => section.id === sectionId)
        : 0;

    const renderFormFields = () =>
        filteredData
            ?.filter(field => getParentSection(field.section_id) === sectionId)
            .map(field => {
                if (field.is_child) return null;

                let sectionHeader = null;
                if (!processedSections.has(field.section_id)) {
                    processedSections.add(field.section_id);
                    sectionHeader = renderSectionHeader(field);
                }

                let fileUploadFields: FileUploadFields | undefined;

                if (
                    field.component === inputComponents.FileUpload ||
                    field.component === inputComponents.FileUploadMultiple
                ) {
                    fileUploadFields = createFileUploadConfig(
                        field.question_id.toString(),
                        field.component,
                        params!.applicationId,
                        setValue,
                        getValues,
                        removeUploadedFile
                    );
                }

                return (
                    <Fragment key={field.question_id}>
                        {sectionHeader}
                        <Box
                            sx={{
                                pt: 1,
                                pb: 0,
                                backgroundColor:
                                    field.name === selectedField
                                        ? theme.palette.grey[100]
                                        : "inherit",
                            }}>
                            {renderFormHydrationField(
                                field,
                                control,
                                field.question_id.toString(),
                                updateGuidanceText,
                                fileUploadFields
                            )}
                        </Box>

                        {/* Process child fields when necessary */}
                        {field.options.flatMap(
                            option =>
                                option.children?.map(child =>
                                    parentValues[field.question_id] ===
                                    option.label ? (
                                        <Fragment key={child.question_id}>
                                            <Box
                                                sx={{
                                                    pt: 1,
                                                    pb: 0,
                                                    backgroundColor:
                                                        child.name ===
                                                        selectedField
                                                            ? theme.palette
                                                                  .grey[100]
                                                            : "inherit",
                                                }}>
                                                {renderFormHydrationField(
                                                    child,
                                                    control,
                                                    child.question_id.toString(),
                                                    updateGuidanceText
                                                )}
                                            </Box>
                                        </Fragment>
                                    ) : null
                                ) || []
                        )}
                    </Fragment>
                );
            });

    const getCompletedVisibleQuestionCount = (
        visibleQuestionIds: string[]
    ): number =>
        visibleQuestionIds.filter(id => !isEmpty(getValues()[id])).length;

    const completedVisibleQuestions = useMemo(
        () => getCompletedVisibleQuestionCount(visibleQuestionIds),
        [visibleQuestionIds, getValues]
    );

    const completedQsCount = `${completedVisibleQuestions}/${visibleQuestionIds.length}`;

    const isMissingRequiredFields = Object.values(formState.errors).some(item =>
        ERROR_TYPE_REQUIRED.includes(item?.type as string)
    );

    const reviewComments = useMemo(
        () => !!reviews?.length && reviews[0].comments,
        [reviews]
    );

    const actionRequiredApplicant = useMemo(() => {
        if (reviews === undefined) {
            return undefined;
        }

        return (
            reviewComments && !reviewComments[reviewComments.length - 1].user_id
        );
    }, [reviews]);

    // If applicant action required, jump to messages section
    useEffect(() => {
        if (!data || actionRequiredApplicant === undefined) {
            return undefined;
        }

        if (teamId) {
            const teamApplication = data.teams.find(
                team => team.team_id.toString() === teamId
            );

            if (
                teamApplication?.approval_status ===
                    DarApplicationApprovalStatus.FEEDBACK &&
                actionRequiredApplicant
            ) {
                return setSectionId(messageSection.id);
            }
        }

        setSectionId(0);
    }, [data, teamId, actionRequiredApplicant]);

    if (sectionId === undefined) {
        return <Loading />;
    }

    return (
        <BoxContainer
            sx={{
                mt: 1.75,
            }}>
            <Link
                href={`/${RouteName.ACCOUNT}/${RouteName.PROFILE}/${RouteName.DATA_ACCESS_REQUESTS}/${RouteName.APPLICATIONS}`}
                underline="hover"
                sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 1,
                    pb: 0.5,
                    pl: 2,
                }}>
                <ArrowBackIosNewIcon fontSize="small" />
                {t("navigateToDashboard")}
            </Link>

            <DarFormBanner
                lastSavedDate={lastSavedDate}
                projectTitle={projectTitle}
                handleSaveAsDraft={handleSaveAsDraft}
            />

            <Box
                sx={{
                    display: "flex",
                    flexDirection: "row",
                    p: 0,
                }}>
                <Box
                    sx={{
                        flex: 1,
                        padding: theme.spacing(1),
                        m: 1,
                    }}>
                    <Sections
                        handleLegendClick={handleChangeSection}
                        sectionId={sectionId}
                        sections={parentSections || []}
                    />
                </Box>

                <Paper sx={{ m: 2, flex: 5 }}>
                    <Box
                        sx={{
                            display: "flex",
                            p: 0,
                            height: "52.5vh",
                        }}>
                        <Box
                            sx={{
                                flex: 2,
                                p: 0,
                                overflowY: "auto",
                                m: 0,
                            }}>
                            {sectionId === 0 ? (
                                <>
                                    <Box>
                                        <Typography variant="h3">
                                            {sections[sectionId].name}
                                        </Typography>
                                        <Typography>
                                            {sections[sectionId].description}
                                        </Typography>
                                    </Box>
                                    <Divider
                                        variant="fullWidth"
                                        sx={{ mb: 4 }}
                                    />

                                    {beforeYouBeginFormFields.map(field => (
                                        <Box
                                            key={field.name}
                                            sx={{ pt: 0, pb: 0 }}>
                                            <InputWrapper
                                                key={field.name}
                                                control={control}
                                                {...field}
                                            />
                                        </Box>
                                    ))}
                                </>
                            ) : parentSections.find(
                                  section => section.id === sectionId
                              )?.name === messageSection.name ? (
                                <DarMessages
                                    applicationId={applicationId}
                                    teamId={teamId!}
                                    reviews={reviews}
                                    mutateReviews={mutateReviews}
                                    loadingReviews={loadingReviews}
                                    reviewComments={reviewComments}
                                    actionRequiredApplicant={
                                        actionRequiredApplicant
                                    }
                                />
                            ) : (
                                renderFormFields()
                            )}
                        </Box>

                        {parentSections.find(
                            section => section.id === sectionId
                        )?.name !== messageSection.name && (
                            <Box
                                sx={{ flex: 1, overflowY: "auto" }}
                                borderLeft={`1px solid ${theme.palette.divider}`}>
                                {guidanceText ? (
                                    <MarkDownSanitizedWithHtml
                                        content={guidanceText}
                                    />
                                ) : (
                                    <Typography
                                        sx={{
                                            color: theme.palette.grey[500],
                                            mt: 2,
                                            textAlign: "center",
                                        }}>
                                        {t("defaultGuidance")}
                                    </Typography>
                                )}
                            </Box>
                        )}
                    </Box>
                </Paper>
            </Box>

            <Paper sx={{ p: 2 }}>
                <Box
                    sx={{
                        p: 0,
                        display: "flex",
                        justifyContent: "space-between",
                        gap: 1,
                    }}>
                    <Box
                        sx={{
                            display: "flex",
                            p: 0,
                            alignItems: "center",
                        }}>
                        <Typography>
                            {t("questionsAnswered", {
                                questionCount: completedQsCount,
                            })}
                        </Typography>
                    </Box>
                    <Box
                        sx={{
                            display: "flex",
                            flexWrap: "wrap",
                            p: 0,
                            m: 0,
                            gap: 1,
                            alignItems: "center",
                        }}>
                        {isMissingRequiredFields && (
                            <Typography
                                sx={{
                                    color: colors.red700,
                                }}>
                                {t("missingRequiredFields")}
                            </Typography>
                        )}

                        <Box sx={{ gap: 1, p: 0, display: "flex" }}>
                            <Button
                                onClick={handleSubmit(handleSave)}
                                type="submit"
                                variant="outlined"
                                color="secondary">
                                {t("submit")}
                            </Button>

                            <Button
                                onClick={() =>
                                    handleChangeSection(
                                        parentSections[currentSectionIndex - 1]
                                            ?.id
                                    )
                                }
                                disabled={isFirstSection(currentSectionIndex)}>
                                {t("previous")}
                            </Button>

                            <Button
                                onClick={() =>
                                    handleChangeSection(
                                        parentSections[currentSectionIndex + 1]
                                            ?.id
                                    )
                                }
                                disabled={
                                    parentSections.length - 1 <=
                                    currentSectionIndex
                                }>
                                {t("next")}
                            </Button>
                        </Box>
                    </Box>
                </Box>
            </Paper>
        </BoxContainer>
    );
};

export default ApplicationSection;
