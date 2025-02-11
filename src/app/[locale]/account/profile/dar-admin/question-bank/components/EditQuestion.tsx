"use client";

import { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { Typography } from "@mui/material";
import { useTranslations } from "next-intl";
import { Option } from "@/interfaces/Option";
import {
    QuestionBankQuestion,
    QuestionBankQuestionForm,
    QuestionBankCreateUpdateQuestion,
} from "@/interfaces/QuestionBankQuestion";
import { QuestionBankSection } from "@/interfaces/QuestionBankSection";
import { Team } from "@/interfaces/Team";
import Button from "@/components/Button";
import Form from "@/components/Form";
import InputWrapper from "@/components/InputWrapper";
import Paper from "@/components/Paper";
import Tabs from "@/components/Tabs";
import useDebounce from "@/hooks/useDebounce";
import useGet from "@/hooks/useGet";
import apis from "@/config/apis";
import {
    componentsWithOptions,
    questionDefaultValues,
    questionValidationSchema,
    sectionField,
    custodiansFields,
} from "@/config/forms/questionBank";
import { colors } from "@/config/theme";
import FormQuestions from "./FormQuestions";
import PreviewQuestion from "./PreviewQuestion";

interface EditQuestionProps {
    onSubmit: (
        payload: QuestionBankCreateUpdateQuestion,
        questionId?: string | number
    ) => Promise<void>;
    question?: QuestionBankQuestion;
}

const TRANSLATION_PATH = `pages.account.profile.darAdmin.qbManagement`;

const EditQuestion = ({ onSubmit, question }: EditQuestionProps) => {
    const t = useTranslations(TRANSLATION_PATH);
    const defaultValues = useMemo(() => questionDefaultValues, []);

    const { data: sectionData } = useGet<QuestionBankSection[]>(
        `${apis.dataAccessSectionV1Url}`
    );

    const [teamOptions, setTeamOptions] = useState<Option[]>([]);
    const [searchName, setSearchName] = useState("");
    const searchNameDebounced = useDebounce(searchName, 500);

    const { data: teamData = [], isLoading: isLoadingTeams } = useGet<Team[]>(
        `${apis.teamsSearchV1Url}?is_question_bank=true&name=${searchNameDebounced}`,
        {
            shouldFetch: !!searchNameDebounced,
        }
    );

    const updateTeamOptions = (
        prevOptions: Option[],
        teamOptions: Option[]
    ) => {
        const existingTeamIds = prevOptions.map(option => option.value);
        const newOptions = teamOptions?.filter(
            option => !existingTeamIds.includes(option.value)
        );
        if (newOptions && newOptions.length) {
            return [...prevOptions, ...newOptions].sort((a, b) =>
                a.label.localeCompare(b.label)
            );
        }
        return prevOptions;
    };

    useEffect(() => {
        const teamOptions = teamData.map(team => ({
            value: team.id,
            label: team.name,
        }));

        setTeamOptions(prevOptions =>
            updateTeamOptions(prevOptions, teamOptions)
        );
    }, [teamData]);

    useEffect(() => {
        if (!question) {
            return;
        }

        const teams =
            question?.teams.map(item => {
                return item.id;
            }) || [];

        if (teams) {
            const labels = question?.teams.map(item => {
                return {
                    label: item.name,
                    value: item.id,
                };
            });
            setTeamOptions(labels);
        }
    }, [question]);

    const handleOnTeamInputChange = (e: React.ChangeEvent, value: string) => {
        if (value === "") {
            setSearchName(value);
            return;
        }
        if (e?.type !== "change") {
            return;
        }
        setSearchName(value);
    };

    const { control, handleSubmit, reset, watch, formState } =
        useForm<QuestionBankQuestionForm>({
            defaultValues,
            resolver: yupResolver(questionValidationSchema),
        });

    const allFields = watch();

    const checkboxValue = watch("all_custodians");

    useEffect(() => {
        if (question) {
            reset(question);
        }
    }, [reset, question, sectionData]);

    const submitForm = async (formData: QuestionBankQuestionForm) => {
        const modifiedFormData = {
            ...formData,
            team_ids: formData.all_custodians ? [] : formData.team_ids,
        };

        onSubmit(modifiedFormData);
    };

    const tabsList = [
        {
            label: "Edit",
            value: "edit",
            content: (
                <Form onSubmit={handleSubmit(submitForm)}>
                    <Paper
                        sx={{
                            marginTop: "10px",
                            marginBottom: "10px",
                            padding: 2,
                        }}>
                        <InputWrapper
                            key={sectionField.name}
                            control={control}
                            {...sectionField}
                            options={
                                sectionData?.map(section => ({
                                    value: section.id,
                                    label: section.name,
                                    isHeader: !section.parent_section,
                                })) || []
                            }
                        />
                    </Paper>

                    <Paper
                        sx={{
                            marginTop: "10px",
                            marginBottom: "10px",
                            padding: 2,
                        }}>
                        <InputWrapper
                            key={custodiansFields[0].name}
                            control={control}
                            {...custodiansFields[0]}
                        />
                        <InputWrapper
                            key={custodiansFields[1].name}
                            control={control}
                            {...custodiansFields[1]}
                            onInputChange={handleOnTeamInputChange}
                            options={teamOptions || []}
                            isLoadingOptions={isLoadingTeams}
                            disabled={checkboxValue}
                        />
                    </Paper>

                    <Paper
                        sx={{
                            marginTop: "10px",
                            marginBottom: "10px",
                            padding: 2,
                        }}>
                        <FormQuestions
                            control={control}
                            showOptions={componentsWithOptions.includes(
                                allFields.component
                            )}
                            watch={watch}
                        />

                        {typeof formState.errors.options?.message ===
                            "string" && (
                            <Typography sx={{ color: colors.red700 }}>
                                {formState.errors.options?.message}
                            </Typography>
                        )}
                    </Paper>

                    <Paper
                        sx={{
                            display: "flex",
                            justifyContent: "end",
                            marginBottom: "10px",
                            padding: 2,
                        }}>
                        <Button type="submit">{t("save")}</Button>
                    </Paper>
                </Form>
            ),
        },
        {
            label: "Preview",
            value: "preview",
            content: <PreviewQuestion question={allFields} control={control} />,
        },
    ];

    return (
        <Tabs
            centered
            tabs={tabsList}
            tabBoxSx={{ padding: 0 }}
            rootBoxSx={{ padding: 0 }}
        />
    );
};
export default EditQuestion;
