"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import Divider from "@mui/material/Divider";
import { useTranslations } from "next-intl";
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
import FormBanner from "@/components/FormBanner";
import Link from "@/components/Link";
import { MarkDownSanitizedWithHtml } from "@/components/MarkDownSanitizedWithHTML";
import Paper from "@/components/Paper";
import Sections from "@/components/Sections";
import Typography from "@/components/Typography";
import usePost from "@/hooks/usePost";
import apis from "@/config/apis";
import { inputComponents } from "@/config/forms";
import theme from "@/config/theme";
import { ArrowBackIosNewIcon, ArrowForwardIosIcon } from "@/consts/icons";
import { RouteName } from "@/consts/routeName";
import {
    isFirstSection,
    renderFormHydrationField,
} from "@/utils/formHydration";
import {
    FormFooter,
    FormFooterItem,
} from "@/app/[locale]/account/team/[teamId]/(withoutLeftNav)/datasets/components/CreateDataset/CreateDataset.styles";

const EDIT_TEMPLATE_TRANSLATION_PATH =
    "pages.account.team.dar.application.create";

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
    const t = useTranslations(EDIT_TEMPLATE_TRANSLATION_PATH);

    const [guidanceText, setGuidanceText] = useState<string>(
        t("defaultGuidance")
    );

    const [sectionId, setSectionId] = useState(1);
    const handleChangeSection = (sectionId: number) => {
        setSectionId(sectionId);
    };

    const updateAnswers = usePost(
        `${apis.dataAccessApplicationV1Url}/${applicationId}/answers`,
        {
            itemName: "Application answers",
        }
    );

    const parentSections = sections?.filter(s => s.parent_section === null);
    const getSection = (id: number) => sections?.find(s => s.id === id);
    const getParentSection = (id: number) => getSection(id)?.parent_section;

    const questions = data?.questions;


    const formatGuidance = (guidance: string) =>
        guidance.replace(/\\n\\n/g, "\n\n");

    const defaultValues = userAnswers?.reduce((acc, a) => {
        const key = questions?.find(
            q => q.question_id === a.question_id
        )?.title;

        acc[key] = a.answer;
        return acc;
    }, {});

    const { control, handleSubmit } = useForm({
        defaultValues,
    });

    const updateGuidanceText = (fieldName: string) => {
        const guidance = questions?.find(
            question => question.title === fieldName
        )?.guidance;

        if (guidance) {
            setGuidanceText(formatGuidance(guidance));
        }
    };

    const clearGuidanceText = () => {
        setGuidanceText(t("defaultGuidance"));
    };

    const filteredData = questions?.filter(
        d => getParentSection(d.section_id) === sectionId
    );

    const renderQuestions = (filteredData: DarApplicationQuestion[]) => {
        const processedSections = new Set();
        console.log(filteredData);

        // TODO - move to a util to stop replication
        return filteredData
            ?.map(q => ({
                section_id: q.section_id,
                title: q.title || "",
                field: {
                    name: q.title,
                    component: q.component,
                    // info: formatGuidance(q?.guidance || ""),
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
                            <Box sx={{ p: 0 }}>
                                <Typography variant="h2">
                                    {sectionName}
                                </Typography>
                                {sectionDescription && (
                                    <>
                                        <Typography sx={{ mb: 2 }}>
                                            {sectionDescription}
                                        </Typography>
                                    </>
                                )}
                            </Box>
                            <Divider
                                variant="fullWidth"
                                sx={{ pt: 2, mb: 4 }}
                            />
                        </>
                    );

                    processedSections.add(sectionId);
                }

                return (
                    <>
                        {sectionData}

                        {renderFormHydrationField(
                            question.field as FormHydrationField,
                            control,
                            undefined,
                            updateGuidanceText,
                            clearGuidanceText
                        )}
                    </>
                );
            });
    };

    const handleSaveChanges = async formData => {
        const answers = Object.keys(formData)
            .map(key => {
                const question_id = questions?.find(
                    q => q.title === key
                )?.question_id;
                return { question_id, answer: formData[key] };
            })
            .filter(a => a.answer !== undefined);

        const payload = {
            answers,
        };
        await updateAnswers(payload);
    };

    const blankFunc = () => {
        console.log("FIRE");
    };

    const isDraft = true;
    const teamId = 1;

    const currentSectionIndex = sectionId
        ? parentSections.findIndex(section => section.id === sectionId)
        : 0;

    return (
        <BoxContainer sx={{ mt: 1.75 }}>
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
                {t("backToManagementPage")}
            </Link>

            <FormBanner
                makeActiveAction={blankFunc}
                saveAsDraftAction={blankFunc}
                completionPercentage={100}
                optionalPercentage={60}
                actionButtonsEnabled={true}
                translationPath="pages.account.team.dar.application.create.FormBanner"
                downloadDetails={{
                    //TODO when endpoint is available
                    name: "",
                    path: "",
                }}
            />

            <Box sx={{ display: "flex", flexDirection: "row", p: 0 }}>
                <Box
                    sx={{
                        flex: 1,
                        padding: theme.spacing(1),
                    }}>
                    <Sections
                        handleLegendClick={handleChangeSection}
                        sectionId={sectionId}
                        sections={parentSections || []}
                    />
                </Box>

                <Box sx={{ flex: 2, p: 0 }}>
                    <Paper
                        sx={{
                            my: theme.spacing(1.25),
                            padding: theme.spacing(2),
                        }}>
                        {filteredData && renderQuestions(filteredData)}
                    </Paper>
                </Box>
                <Box sx={{ flex: 1, p: 0 }}>
                    <Paper
                        style={{
                            alignItems: "center",
                            padding: theme.spacing(2),
                            margin: theme.spacing(1.25),
                            position: "sticky",
                            top: theme.spacing(1.25),
                            overflowY: "auto",
                            maxHeight: "100vh",
                        }}>
                        <Typography variant="h2">Guidance</Typography>
                        {guidanceText && (
                            <MarkDownSanitizedWithHtml content={guidanceText} />
                        )}
                    </Paper>
                </Box>
            </Box>
            <Box
                sx={{
                    padding: theme.spacing(1),
                    margin: theme.spacing(2),
                }}>
                <FormFooter>
                    <FormFooterItem>
                        <Button
                            onClick={() =>
                                handleChangeSection(
                                    parentSections[currentSectionIndex - 1]?.id
                                )
                            }
                            disabled={isFirstSection(currentSectionIndex)}
                            variant="text"
                            startIcon={<ArrowBackIosNewIcon />}>
                            {t("previous")}
                        </Button>
                    </FormFooterItem>

                    <FormFooterItem>
                        <Button
                            onClick={() =>
                                handleChangeSection(
                                    parentSections[currentSectionIndex + 1]?.id
                                )
                            }
                            disabled={
                                parentSections.length - 1 <= currentSectionIndex
                            }
                            endIcon={<ArrowForwardIosIcon />}>
                            {t("next")}
                        </Button>
                    </FormFooterItem>
                </FormFooter>
            </Box>

            {/* <Paper sx={{ m: 2, p: 2, mb: 5 }}>
                    <Box
                        sx={{
                            p: 0,
                            display: "flex",
                            justifyContent: "end",
                        }}>
                        <Button
                            onClick={handleSubmit(handleSaveChanges)}
                            type="submit">
                            {t("save")}
                        </Button>
                    </Box>
                </Paper> */}
        </BoxContainer>
    );
};

export default ApplicationSection;
