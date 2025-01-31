"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { Divider } from "@mui/material";
import dayjs from "dayjs";
import { isEmpty } from "lodash";
import { useTranslations } from "next-intl";
import { buildYup } from "schema-to-yup";
import {
    DarApplication,
    DarApplicationQuestion,
    DarApplicationAnswer,
} from "@/interfaces/DataAccessRequest";
import { FormHydrationField } from "@/interfaces/FormHydration";
import { QuestionBankSection } from "@/interfaces/QuestionBankSection";
import Box from "@/components/Box";
import BoxContainer from "@/components/BoxContainer";
import Button from "@/components/Button";
import {
    Column,
    DetailBanner,
    Justify,
} from "@/components/FormBanner/FormBanner.styles";
import InputWrapper from "@/components/InputWrapper";
import Link from "@/components/Link";
import { MarkDownSanitizedWithHtml } from "@/components/MarkDownSanitizedWithHTML";
import Paper from "@/components/Paper";
import Sections from "@/components/Sections";
import Typography from "@/components/Typography";
import usePut from "@/hooks/usePut";
import apis from "@/config/apis";
import { inputComponents } from "@/config/forms";
import {
    darApplicationFormFields,
    darApplicationValidationSchema,
    LAST_SAVED_DATE_FORMAT,
} from "@/config/forms/dataAccessApplication";
import theme from "@/config/theme";
import { AccessTimeIcon, ArrowBackIosNewIcon } from "@/consts/icons";
import { RouteName } from "@/consts/routeName";
import {
    isFirstSection,
    renderFormHydrationField,
} from "@/utils/formHydration";

const TRANSLATION_PATH = "pages.account.team.dar.application.create";

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

    const [selectedField, setSelectedField] = useState<string>();

    const [lastSavedDate, setLastSavedDate] = useState<number>();

    const [guidanceText, setGuidanceText] = useState<string>(
        t("defaultGuidance")
    );

    const [sectionId, setSectionId] = useState(0);
    const handleChangeSection = (sectionId: number) => {
        setSectionId(sectionId);
    };

    const updateApplication = usePut(`${apis.dataAccessApplicationV1Url}`, {
        itemName: "Data Access Request",
        successNotificationsOn: false,
    });

    const updateAnswers = usePut(
        `${apis.dataAccessApplicationV1Url}/${applicationId}/answers`,
        {
            itemName: "Data Access Request",
        }
    );

    const parentSections = sections?.filter(s => s.parent_section === null);

    const getSection = (id: number) => sections?.find(s => s.id === id);
    const getParentSection = (id: number) => getSection(id)?.parent_section;

    const questions = data?.questions;

    const formatGuidance = (guidance: string) =>
        guidance.replace(/\\n\\n/g, "\n\n");

    const defaultValues = Object.fromEntries(
        userAnswers?.map(a => [a.question_id, a.answer])
    );

    const generateYupSchema = fields => {
        const schemaConfig = {};

        const processField = field => {
            let fieldSchema = {
                type: "string", // Default type
                label: field.title,
                required: !!field.required,
            };

            if (field.validations?.length) {
                fieldSchema.errors = {};
                field.validations.forEach(validation => {
                    Object.keys(validation).forEach(rule => {
                        if (rule !== "message") {
                            fieldSchema[rule] = validation[rule];
                            fieldSchema.errors[rule] = validation.message;
                        }
                    });
                });
            }

            schemaConfig[field.question_id] = fieldSchema;

            // Process children recursively if they exist inside options
            if (field.options?.length) {
                field.options.forEach(option => {
                    if (option.children?.length) {
                        option.children.forEach(processField);
                    }
                });
            }
        };

        fields.forEach(processField);

        return buildYup({ type: "object", properties: schemaConfig });
    };
    const yupSchema = generateYupSchema(data.questions);

    const { control, handleSubmit, getValues, watch } = useForm({
        defaultValues: {
            ...defaultValues,
            project_title: data.project_title,
        },
        resolver: yupResolver(darApplicationValidationSchema.concat(yupSchema)),
    });

    const projectTitle = watch("project_title");

    const updateGuidanceText = (fieldName: string) => {
        setSelectedField(fieldName);

        const guidance = questions?.find(
            question => question.title === fieldName
        )?.guidance;

        if (guidance) {
            setGuidanceText(formatGuidance(guidance));
        }
    };

    const filteredData = questions?.filter(
        d => getParentSection(d.section_id) === sectionId
    );

    const renderQuestions = (filteredData: DarApplicationQuestion[]) => {
        const processedSections = new Set();

        return filteredData
            ?.map(q => ({
                section_id: q.section_id,
                title: q.title || "",
                questionId: q.question_id,
                field: {
                    name: q.title,
                    component: q.component,
                    required: q.required,
                    ...(q.component === inputComponents.RadioGroup && {
                        radios: q?.options?.map(option => ({
                            label: option.label,
                            value: option.label,
                        })),
                    }),
                    ...(q.component === inputComponents.CheckboxGroup && {
                        checkboxes: q?.options?.map(option => ({
                            label: option.label,
                            value: option.label,
                        })),
                    }),
                },
                tempOptions: q.options,
            }))
            ?.map(question => {
                const section = getSection(question.section_id);

                const {
                    name: sectionName,
                    description: sectionDescription,
                    id: sectionId,
                } = section || {};

                let sectionData;
                if (!processedSections.has(sectionId)) {
                    sectionData = (
                        <>
                            <Box>
                                <Typography variant="h3">
                                    {sectionName}
                                </Typography>
                            </Box>
                            <Divider variant="fullWidth" sx={{ mb: 4 }} />
                        </>
                    );

                    processedSections.add(sectionId);
                }

                return (
                    <div key={question.questionId}>
                        {sectionData}

                        <Box
                            sx={{
                                pt: 1,
                                pb: 0,
                                backgroundColor:
                                    question.field.name === selectedField
                                        ? theme.palette.grey[100]
                                        : "inherit",
                            }}>
                            {renderFormHydrationField(
                                question.field as FormHydrationField,
                                control,
                                question.questionId.toString(),
                                updateGuidanceText
                            )}
                        </Box>
                    </div>
                );
            });
    };

    const handleSaveChanges = async formData => {
        //TODO
    };

    const handleSaveAsDraft = async () => {
        //TODO
    };

    const currentSectionIndex = sectionId
        ? parentSections.findIndex(section => section.id === sectionId)
        : 0;

    const completedQsCount = `${
        Object.values(getValues()).filter(value => !isEmpty(value)).length
    }/${data.questions.length + darApplicationFormFields.length}`;

    return (
        <BoxContainer
            sx={{
                mt: 1.75,
            }}>
            <Link
                href={`/${RouteName.ACCOUNT}/${RouteName.DATA_ACCESS_REQUESTS}`}
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

            {/* //split to own component */}
            <DetailBanner sx={{ pt: 2.5, pb: 2.5 }}>
                <Column justify={Justify.START} sx={{ gap: 2 }}>
                    <Typography variant="h2" component={"p"} sx={{ m: 0 }}>
                        {"darRequest"}
                    </Typography>
                    <Typography>{projectTitle}</Typography>
                </Column>

                <Column justify={Justify.END}>
                    {lastSavedDate && (
                        <>
                            <AccessTimeIcon fontSize="small" />
                            <Typography sx={{ display: "flex", ml: 1, mr: 2 }}>
                                {t("lastSaved", {
                                    date: dayjs(lastSavedDate).format(
                                        LAST_SAVED_DATE_FORMAT
                                    ),
                                })}
                            </Typography>
                        </>
                    )}

                    <Button onClick={handleSaveAsDraft} size="small">
                        {t("save")}
                    </Button>
                </Column>
            </DetailBanner>

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
                        }}>
                        <Box
                            sx={{
                                flex: 2,
                                p: 0,
                                overflowY: "auto",
                                height: "52.5vh",
                                m: 0,
                            }}>
                            {(sectionId === 0 && (
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

                                    {darApplicationFormFields.map(field => (
                                        <div key={field.name}>
                                            <Box sx={{ pt: 0, pb: 0 }}>
                                                <InputWrapper
                                                    key={field.name}
                                                    control={control}
                                                    {...field}
                                                />
                                            </Box>
                                        </div>
                                    ))}
                                </>
                            )) ||
                                renderQuestions(filteredData)}
                        </Box>
                        <Box
                            sx={{ flex: 1 }}
                            borderLeft={`1px solid ${theme.palette.divider}`}>
                            <Typography variant="h2">
                                {t("guidance")}
                            </Typography>
                            {guidanceText && (
                                <MarkDownSanitizedWithHtml
                                    content={guidanceText}
                                />
                            )}
                        </Box>
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
                    <Box sx={{ display: "flex", p: 0, m: 0, gap: 1 }}>
                        <Button
                            onClick={handleSubmit(handleSaveChanges)}
                            type="submit"
                            variant="outlined"
                            color="secondary">
                            {t("submit")}
                        </Button>

                        <Button
                            onClick={() =>
                                handleChangeSection(
                                    parentSections[currentSectionIndex - 1]?.id
                                )
                            }
                            disabled={isFirstSection(currentSectionIndex)}>
                            {t("previous")}
                        </Button>

                        <Button
                            onClick={() =>
                                handleChangeSection(
                                    parentSections[currentSectionIndex + 1]?.id
                                )
                            }
                            disabled={
                                parentSections.length - 1 <= currentSectionIndex
                            }>
                            {t("next")}
                        </Button>
                    </Box>
                </Box>
            </Paper>
        </BoxContainer>
    );
};

export default ApplicationSection;
