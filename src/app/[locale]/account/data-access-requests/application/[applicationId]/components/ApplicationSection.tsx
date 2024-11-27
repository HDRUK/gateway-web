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
import { QuestionBankSection } from "@/interfaces/QuestionBankSection";
import Box from "@/components/Box";
import Button from "@/components/Button";
import Container from "@/components/Container";
import { MarkDownSanitizedWithHtml } from "@/components/MarkDownSanitizedWithHTML";
import Paper from "@/components/Paper";
import Sections from "@/components/Sections";
import Typography from "@/components/Typography";
import useAuth from "@/hooks/useAuth";
import useChat from "@/hooks/useChat";
import usePost from "@/hooks/usePost";
import apis from "@/config/apis";
import theme from "@/config/theme";
import { renderFormHydrationField } from "@/utils/formHydration";

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
    const { user } = useAuth();
    const showChat = useChat();

    const handleClickShowChat = (
        event: React.MouseEvent<HTMLButtonElement>
    ) => {
        event?.stopPropagation();
        showChat({ dataset: null, isLoggedIn: true, redirectPath: "/" });
    };

    const [guidanceText, setGuidanceText] = useState<string>(
        t("defaultGuidance")
    );

    const [sectionId, setSectionId] = useState(1);
    const handleChangeSection = (sectionId: number) => {
        setSectionId(sectionId);
    };

    const updateAnswers = usePost(
        `${apis.darasV1Url}/applications/${applicationId}/answers?user_id=${user?.id}`,
        {
            itemName: "Application answers",
        }
    );

    const parentSections = sections?.filter(s => s.parent_section === null);
    const getSection = (id: number) => sections?.find(s => s.id === id);
    const getParentSection = (id: number) => getSection(id)?.parent_section;

    const questions = data?.questions;

    const defaultValues = userAnswers?.reduce((acc, a) => {
        const key = questions?.find(q => q.question_id === a.question_id)
            ?.latest_version.title;

        acc[key] = a.answer;
        return acc;
    }, {});

    const { control, handleSubmit } = useForm({
        defaultValues,
    });

    const updateGuidanceText = (fieldName: string) => {
        const guidance = questions
            ?.find(question => question.latest_version.title === fieldName)
            ?.guidance?.replaceAll("\\n", "\n");
        if (guidance) {
            setGuidanceText(guidance);
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
        return filteredData
            ?.map(q => ({
                section_id: q.section_id,
                field: {
                    ...q.latest_version.field,
                    required: q.required,
                    name: q.latest_version.title,
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
                        <Box sx={{ my: 2, p: 0 }}>
                            <Divider>
                                <Typography variant="h2">
                                    {sectionName}{" "}
                                </Typography>
                            </Divider>
                            {sectionDescription && (
                                <>
                                    <Typography sx={{ mb: 2 }}>
                                        {sectionDescription}
                                    </Typography>
                                    <Divider variant="middle" />
                                </>
                            )}
                        </Box>
                    );

                    processedSections.add(sectionId);
                }

                return (
                    <>
                        {sectionData}
                        {renderFormHydrationField(
                            question.field,
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
                    q => q.latest_version.title === key
                )?.question_id;
                return { question_id, answer: formData[key] };
            })
            .filter(a => a.answer !== undefined);

        const payload = {
            answers,
        };
        await updateAnswers(payload);
    };

    return (
        <Container maxWidth={false}>
            <Container
                maxWidth={false}
                sx={{
                    display: "grid",
                    gridTemplateColumns: "2fr 5fr 3fr",
                    gap: 0,
                    pt: 2,
                }}>
                <Box sx={{ flex: 3, p: 0 }}>
                    <Sections
                        containerSx={{
                            padding: theme.spacing(2),
                            px: 0,
                            margin: theme.spacing(1.25),
                            position: "sticky",
                            top: theme.spacing(1.25),
                            overflowY: "auto",
                            maxHeight: "100vh",
                        }}
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
            </Container>
            <Paper sx={{ m: 2, p: 2, mb: 5 }}>
                <Box
                    sx={{
                        p: 0,
                        display: "flex",
                        justifyContent: "end",
                        gap: 1,
                    }}>
                    <Button color="secondary" onClick={handleClickShowChat}>
                        {t("chat")}
                    </Button>
                    <Button
                        onClick={handleSubmit(handleSaveChanges)}
                        type="submit">
                        {t("save")}
                    </Button>
                </Box>
            </Paper>
        </Container>
    );
};

export default ApplicationSection;
