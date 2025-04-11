"use client";

import { Fragment, useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { Divider } from "@mui/material";
import { isEmpty } from "lodash";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import {
    DarApplication,
    DarApplicationAnswer,
    DarApplicationResponses,
    DarFormattedField,
} from "@/interfaces/DataAccessRequest";
import { DarTeamApplication } from "@/interfaces/DataAccessRequestApplication";
import { DarReviewsResponse } from "@/interfaces/DataAccessReview";
import { FileUploadFields } from "@/interfaces/FileUpload";
import { QuestionBankSection } from "@/interfaces/QuestionBankSection";
import Box from "@/components/Box";
import BoxContainer from "@/components/BoxContainer";
import Button from "@/components/Button";
import Chip from "@/components/Chip";
import InputWrapper from "@/components/InputWrapper";
import Link from "@/components/Link";
import { MarkDownSanitizedWithHtml } from "@/components/MarkDownSanitizedWithHTML";
import Paper from "@/components/Paper";
import Sections from "@/components/Sections";
import Typography from "@/components/Typography";
import DarManageDialog from "@/modules/DarManageDialog";
import useDelete from "@/hooks/useDelete";
import useDialog from "@/hooks/useDialog";
import notificationService from "@/services/notification";
import apis from "@/config/apis";
import { inputComponents } from "@/config/forms";
import {
    beforeYouBeginFormFields,
    darApplicationValidationSchema,
    excludedQuestionFields,
    generateYupSchema,
    LAST_SAVED_DATE_FORMAT,
    messageSection,
} from "@/config/forms/dataAccessApplication";
import theme, { colors } from "@/config/theme";
import {
    DarApplicationApprovalStatus,
    DarApplicationStatus,
} from "@/consts/dataAccess";
import { ArrowBackIosNewIcon, HelpOutlineIcon } from "@/consts/icons";
import { RouteName } from "@/consts/routeName";
import {
    createFileUploadConfig,
    formatDarQuestion,
    getVisibleQuestionIds,
    mapKeysToValues,
} from "@/utils/dataAccessRequest";
import { formatDate } from "@/utils/date";
import {
    isFirstSection,
    renderFormHydrationField,
} from "@/utils/formHydration";
import { updateDarApplicationAnswersAction } from "@/app/actions/updateDarApplicationAnswers";
import { updateDarApplicationTeamAction } from "@/app/actions/updateDarApplicationTeam";
import { updateDarApplicationUserAction } from "@/app/actions/updateDarApplicationUser";
import notFound from "@/app/not-found";
import DarFormBanner from "./DarFormBanner";
import DarMessages from "./DarMessages";

const TRANSLATION_PATH = "pages.account.team.dar.application.create";
const PROJECT_TITLE_FIELD = "project_title";
const ERROR_TYPE_REQUIRED = ["required", "optionality"];

interface ApplicationSectionProps {
    teamId?: string;
    userId: string;
    applicationId: string;
    data: DarApplication;
    userAnswers: DarApplicationAnswer[];
    sections: QuestionBankSection[];
    teamApplication?: DarTeamApplication;
    initialSectionId: number;
    isResearcher: boolean;
    parentSections: QuestionBankSection[];
    reviews: DarReviewsResponse[];
}

const ApplicationSection = ({
    teamId,
    userId,
    applicationId,
    data,
    userAnswers,
    sections,
    teamApplication,
    initialSectionId,
    isResearcher,
    parentSections,
    reviews,
}: ApplicationSectionProps) => {
    const t = useTranslations(TRANSLATION_PATH);
    const commonT = useTranslations("common.dar.status");

    const { showDialog } = useDialog();
    const { push } = useRouter();

    const darApplicationEndpoint = isResearcher
        ? `${apis.usersV1Url}/${userId}/dar/applications`
        : `${apis.teamsV1Url}/${teamId}/dar/applications`;

    const [selectedField, setSelectedField] = useState<string>();
    const [lastSavedDate, setLastSavedDate] = useState<Date>();
    const [guidanceText, setGuidanceText] = useState<string>();
    const [sectionId, setSectionId] = useState<number>(initialSectionId);

    const handleChangeSection = (sectionId?: number) => {
        if (sectionId === undefined) {
            return;
        }

        setSectionId(sectionId);
    };

    const removeUploadedFile = useDelete(
        `${darApplicationEndpoint}/${applicationId}/files`,
        {
            itemName: "File",
        }
    );

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

        const guidance = [...questions, ...beforeYouBeginFormFields]?.find(
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
    }, [questions, sectionId]);

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
            submission_status: DarApplicationStatus.DRAFT,
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

        if (formData) {
            const [resAnswers, resApplication] = await Promise.all([
                updateDarApplicationAnswersAction(applicationId, userId, {
                    ...applicationData,
                    answers,
                }),
                isResearcher
                    ? updateDarApplicationUserAction(applicationId, userId, {
                          submission_status: DarApplicationStatus.SUBMITTED,
                      })
                    : teamId &&
                      updateDarApplicationTeamAction(applicationId, teamId, {
                          submission_status: DarApplicationStatus.SUBMITTED,
                      }),
            ]);

            if (resAnswers && resApplication) {
                push(
                    `/${RouteName.ACCOUNT}/${RouteName.PROFILE}/${RouteName.DATA_ACCESS_REQUESTS}/${RouteName.APPLICATIONS}`
                );
            } else {
                notificationService.apiError("Failed to submit application");
            }
        } else {
            const resAnswers = await updateDarApplicationAnswersAction(
                applicationId,
                userId,
                {
                    ...applicationData,
                    answers,
                }
            );

            if (resAnswers) {
                notificationService.apiSuccess(
                    "Successfully updated Data Access Request"
                );
            } else {
                notificationService.apiError(
                    "Failed to update Data Access Request"
                );
            }
        }
    };

    const handleSave = async (formData: DarApplicationResponses) => {
        await saveApplication(formData);
    };

    const handleSaveAsDraft = async () => {
        await saveApplication();
    };

    const handleManageApplication = () => {
        showDialog(DarManageDialog, { darApplicationEndpoint, applicationId });
    };

    const processedSections = new Set();

    const renderSectionHeader = (field: DarFormattedField) => (
        <>
            <Box sx={{ pl: 3, pr: 3 }}>
                <Typography variant="h3" sx={{ m: 0 }}>
                    {getSection(field.section_id)?.name}
                </Typography>
            </Box>
            <Divider variant="fullWidth" sx={{ mb: 4 }} />
        </>
    );

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
                    const fileDownloadApiPath = isResearcher
                        ? `${apis.usersV1Url}/${userId}/dar/applications/${applicationId}/files`
                        : `${apis.teamsV1Url}/${teamId}/dar/applications/${applicationId}/files`;

                    fileUploadFields = createFileUploadConfig(
                        field.question_id.toString(),
                        field.component,
                        applicationId,
                        fileDownloadApiPath,
                        isResearcher,
                        setValue,
                        getValues,
                        teamApplication?.submission_status !==
                            DarApplicationStatus.SUBMITTED
                            ? removeUploadedFile
                            : undefined
                    );
                }

                return (
                    <Fragment key={field.question_id}>
                        {sectionHeader}
                        <Box
                            sx={{
                                pt: 1,
                                pb: 0,
                                pl: 3,
                                pr: 3,
                                backgroundColor:
                                    field.name === selectedField
                                        ? theme.palette.grey[100]
                                        : "inherit",
                            }}>
                            {renderFormHydrationField(
                                {
                                    ...field,
                                    disabled:
                                        !isResearcher ||
                                        (isResearcher &&
                                            teamApplication &&
                                            teamApplication?.approval_status !==
                                                null),
                                },
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
                                                    pl: 3,
                                                    pr: 3,
                                                    backgroundColor:
                                                        child.name ===
                                                        selectedField
                                                            ? theme.palette
                                                                  .grey[100]
                                                            : "inherit",
                                                }}>
                                                {renderFormHydrationField(
                                                    {
                                                        ...child,
                                                        disabled:
                                                            !isResearcher ||
                                                            (isResearcher &&
                                                                teamApplication &&
                                                                teamApplication?.approval_status !==
                                                                    null),
                                                    },
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

    // Set initial last saved date
    useEffect(() => {
        if (!teamApplication) {
            return;
        }

        setLastSavedDate(new Date(teamApplication.updated_at));
    }, [teamApplication]);

    if (!teamApplication && teamId) {
        notFound();
    }

    return (
        <BoxContainer
            sx={{
                mt: 1.75,
            }}>
            <Link
                href={
                    isResearcher
                        ? `/${RouteName.ACCOUNT}/${RouteName.PROFILE}/${RouteName.DATA_ACCESS_REQUESTS}/${RouteName.APPLICATIONS}`
                        : `/${RouteName.ACCOUNT}/${RouteName.TEAM}/${teamId}/${RouteName.DATA_ACCESS_REQUESTS}/${RouteName.APPLICATIONS}`
                }
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
                buttonText={isResearcher ? "save" : "manage"}
                buttonAction={
                    isResearcher &&
                    (!teamApplication ||
                        (teamApplication?.approval_status === null &&
                            teamApplication.submission_status !==
                                DarApplicationStatus.SUBMITTED))
                        ? handleSaveAsDraft
                        : !isResearcher &&
                          teamApplication?.approval_status ===
                              DarApplicationApprovalStatus.FEEDBACK
                        ? handleManageApplication
                        : undefined
                }
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
                        padding: 1,
                        m: 1,
                    }}>
                    <Sections
                        handleLegendClick={handleChangeSection}
                        sectionId={sectionId}
                        sections={parentSections || []}
                    />
                </Box>

                <Paper
                    sx={{
                        m: 2,
                        flex: 5,
                        height: "65vh",
                        display: "flex",
                        flexDirection: "column",
                    }}>
                    {parentSections.find(section => section.id === sectionId)
                        ?.name !== messageSection.name && (
                        <>
                            <Box sx={{ p: 3 }}>
                                <Typography
                                    variant="h2"
                                    sx={{ p: 2, pl: 0, pb: 1 }}>
                                    {sections[sectionId].name}
                                </Typography>
                                <Typography>
                                    {sections[sectionId].description}
                                </Typography>
                            </Box>
                            <Divider variant="fullWidth" />
                        </>
                    )}

                    <Box
                        sx={{
                            display: "flex",
                            p: 0,
                            overflowY: "auto",
                            flex: 1,
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
                                    {beforeYouBeginFormFields.map(field => (
                                        <Box key={field.name} sx={{ p: 0 }}>
                                            <Box sx={{ pl: 3, pr: 3 }}>
                                                <Typography
                                                    variant="h3"
                                                    sx={{
                                                        m: 0,
                                                    }}>
                                                    {t("nameApplication")}
                                                </Typography>
                                            </Box>
                                            <Divider
                                                variant="fullWidth"
                                                sx={{ mb: 4 }}
                                            />
                                            <Box sx={{ pt: 0, pl: 3, pr: 3 }}>
                                                <InputWrapper
                                                    key={field.name}
                                                    control={control}
                                                    {...field}
                                                    disabled={
                                                        !isResearcher ||
                                                        (isResearcher &&
                                                            teamApplication &&
                                                            teamApplication?.approval_status !==
                                                                null)
                                                    }
                                                    onFocus={() =>
                                                        updateGuidanceText(
                                                            field.name
                                                        )
                                                    }
                                                />
                                            </Box>
                                        </Box>
                                    ))}
                                </>
                            ) : reviews &&
                              parentSections.find(
                                  section => section.id === sectionId
                              )?.name === messageSection.name ? (
                                <DarMessages
                                    applicationId={applicationId}
                                    teamId={teamId}
                                    userId={userId}
                                    initialReviews={reviews}
                                    darApplicationEndpoint={
                                        darApplicationEndpoint
                                    }
                                    isResearcher={isResearcher}
                                />
                            ) : (
                                renderFormFields()
                            )}
                        </Box>

                        {parentSections.find(
                            section => section.id === sectionId
                        )?.name !== messageSection.name && (
                            <Box sx={{ flex: 1, overflowY: "auto", p: 0 }}>
                                <Box>
                                    <Typography
                                        variant="h3"
                                        sx={{
                                            display: "flex",
                                            alignItems: "center",
                                            justifyContent: "center",
                                            m: 0,
                                        }}>
                                        <HelpOutlineIcon
                                            sx={{
                                                mr: 1,
                                                color: colors.grey600,
                                                fontSize: 16,
                                            }}
                                        />
                                        {t("guidance")}
                                    </Typography>
                                </Box>
                                <Divider variant="fullWidth" sx={{ mb: 4 }} />
                                <Box
                                    sx={{
                                        pt: 0,
                                        pb: 0,
                                    }}>
                                    {guidanceText ? (
                                        <MarkDownSanitizedWithHtml
                                            content={guidanceText}
                                        />
                                    ) : (
                                        <Typography
                                            sx={{
                                                color: theme.palette.grey[500],
                                                textAlign: "center",
                                            }}>
                                            {t("defaultGuidance")}
                                        </Typography>
                                    )}
                                </Box>
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
                        {isResearcher &&
                        !teamApplication?.approval_status &&
                        teamApplication?.submission_status ===
                            DarApplicationStatus.DRAFT ? (
                            <Typography>
                                {t("questionsAnswered", {
                                    questionCount: completedQsCount,
                                })}
                            </Typography>
                        ) : (
                            <>
                                {teamApplication?.approval_status && (
                                    <Chip
                                        label={commonT(
                                            teamApplication.approval_status.toLowerCase()
                                        )}
                                        sx={{ mr: 1 }}
                                        color={
                                            teamApplication.approval_status ===
                                            DarApplicationApprovalStatus.REJECTED
                                                ? "error"
                                                : [
                                                      DarApplicationApprovalStatus.APPROVED,
                                                      DarApplicationApprovalStatus.APPROVED_COMMENTS,
                                                  ].includes(
                                                      teamApplication.approval_status
                                                  )
                                                ? "success"
                                                : "warningCustom"
                                        }
                                    />
                                )}
                                {data?.submission_date && (
                                    <Typography>
                                        {t("submittedOn", {
                                            date: formatDate(
                                                data.submission_date,
                                                LAST_SAVED_DATE_FORMAT
                                            ),
                                        })}
                                    </Typography>
                                )}
                            </>
                        )}
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
                            {isResearcher &&
                                (!teamApplication ||
                                    (teamApplication?.approval_status ===
                                        null &&
                                        teamApplication.submission_status !==
                                            DarApplicationStatus.SUBMITTED)) && (
                                    <Button
                                        onClick={handleSubmit(handleSave)}
                                        type="submit"
                                        variant="outlined"
                                        color="secondary">
                                        {t("submit")}
                                    </Button>
                                )}

                            <Button
                                onClick={() =>
                                    handleChangeSection(
                                        parentSections?.[
                                            currentSectionIndex - 1
                                        ]?.id
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
