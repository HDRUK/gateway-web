"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import Divider from "@mui/material/Divider";
import Markdown from "markdown-to-jsx";
import { useSearchParams } from "next/navigation";
import { DarApplicationQuestion } from "@/interfaces/DataAccessRequest";
import { QuestionBankSection } from "@/interfaces/QuestionBankSection";
import Box from "@/components/Box";
import Container from "@/components/Container";
import Paper from "@/components/Paper";
import Sections from "@/components/Sections";
import Typography from "@/components/Typography";
import useGet from "@/hooks/useGet";
import apis from "@/config/apis";
import theme from "@/config/theme";
import { renderFormHydrationField } from "@/utils/formHydration";

const DEFAULT_GUIDANCE = "Please click on a question to display guidance";

const Application = () => {
    const [guidanceText, setGuidanceText] = useState<string>(DEFAULT_GUIDANCE);
    const searchParams = useSearchParams();
    const team_ids = searchParams?.get("team_ids");

    const [sectionId, setSectionId] = useState(1);
    const handleChangeSection = (sectionId: number) => {
        setSectionId(sectionId);
    };

    const { data: sections } = useGet<QuestionBankSection[]>(
        `${apis.questionBankV1Url}/sections`,
        { keepPreviousData: true }
    );

    const queryString = team_ids ? `?team_ids=${team_ids}` : "";
    const { data } = useGet<DarApplicationQuestion[]>(
        `${apis.darasV1Url}/dar-applications${queryString}`,
        {
            itemName: "DAR Application",
        }
    );

    const parentSections = sections?.filter(s => s.parent_section === null);
    const getSection = (id: number) => sections?.find(s => s.id === id);
    const getParentSection = (id: number) => getSection(id)?.parent_section;

    const { control } = useForm();

    const updateGuidanceText = (fieldName: string) => {
        const guidance = data
            ?.find(question => question.title === fieldName)
            ?.guidance?.replaceAll("\\n", "\n");
        if (guidance) {
            setGuidanceText(guidance);
        }
    };

    const clearGuidanceText = () => {
        setGuidanceText(DEFAULT_GUIDANCE);
    };

    const filteredData = data?.filter(
        d => getParentSection(d.section_id) === sectionId
    );

    const renderQuestions = (filteredData: DarApplicationQuestion[]) => {
        const processedSections = new Set();
        return filteredData
            ?.map(q => ({
                ...q,
                field: {
                    ...q.field,
                    required: q.required,
                    name: q.title,
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

    return (
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
                    {guidanceText && <Markdown>{guidanceText}</Markdown>}
                </Paper>
            </Box>
        </Container>
    );
};

export default Application;
