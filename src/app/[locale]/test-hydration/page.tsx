"use client";
import Header from "@/components/Header";

import Container from "@/components/Container";
import Card from "@/components/Card";
import { CardActions, CardContent, CardHeader } from "@mui/material";
import Paper from "@/components/Paper";
import { formatDate } from "@/utils/date";
import usePost from "@/hooks/usePost";
import useGet from "@/hooks/useGet";
import apis from "@/config/apis";
import { useEffect, useState } from "react";
import { inputComponents } from "@/config/forms";
import InputWrapper from "@/components/InputWrapper";
import Form from "@/components/Form";
import Button from "@/components/Button";
import { useForm } from "react-hook-form";

import data from "./form.json";

import Box from "@/components/Box";

import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

const getStringField = (name, control, setValue) => {
    const field = {
        component: inputComponents.TextField,
        variant: "outlined",
        name: name || "",
        placeholder: "Enter a value",
        label: "",
        showClearButton: true,
    };

    return (
        <InputWrapper
            horizontalForm={false}
            control={control}
            setValue={setValue}
            {...field}
        />
    );
};

const getType = t => {
    if (!t) return;

    const { control, setValue } = useForm({});

    const { type } = t;
    if (type == "string") {
        return getStringField(t?.title, control, setValue);
    }
    return t?.type;
};

const getHeader = k => {
    const parts = k.split(".");
    return <h2> {parts[parts.length - 1]} </h2>;
};

const FormElement = (k, d) => {
    return (
        <>
            {getHeader(k)}
            <Card>
                <CardHeader
                    title={d.title}
                    titleTypographyProps={{ fontSize: "18px" }}></CardHeader>
                <CardContent>
                    {d.description} <br /> <b> {getType(d?.types)} </b>
                </CardContent>
            </Card>
        </>
    );
};

const TestPageOld = () => {
    return (
        <>
            <Header />
            <Paper sx={{ mx: 5, px: 5 }}>
                <h2>Hydration Form</h2>
                <Container>
                    {Object.keys(data)
                        .filter(k => k.includes("summary."))
                        .map(k => FormElement(k, data[k]))}
                </Container>
            </Paper>
        </>
    );
};

interface QuestionBankForm {
    section: number;
    title: string;
    description: string;
    type: string;
}

interface Validation {
    [key: string]: null | any[];
}

interface QuestionJson {
    name: string;
    title: string;
    description: string;
    guidance: string;
    validation: Validation[];
    field: {
        component: string;
        variant: string;
        name: string;
        placeholder: string;
        label: string;
        showClearButton: boolean;
    };
}

interface QuestionBank {
    name: string;
    description: string;
    default: any;
    question_json: QuestionJson;
}

const formFields = [
    {
        label: "Question Title",
        name: "title",
        info: "Please specify the title of this question",
        component: inputComponents.TextField,
        required: true,
    },
    {
        label: "Question Description",
        name: "description",
        info: "Please specify the description of this question",
        component: inputComponents.TextArea,
        required: true,
    },
    {
        label: "Question Type",
        name: "type",
        //nColumns: 4,
        info: "Please select the input method for your question",
        //formControlSx: { m: 0, p: 0, mb: 0 },
        //required: true,
        isRow: true,
        component: inputComponents.RadioGroup,
        radios: [
            { value: "textInput", label: "Text Input" },
            { value: "textArea", label: "Text Area" },
            { value: "select", label: "Select" },
            { value: "radio", label: "Radio" },
            { value: "checkbox", label: "Checkbox" },
            { value: "fileUpload", label: "File Upload" },
            { value: "autocomplete", label: "Auto Complete" },
            { value: "timePicker", label: "Time Picker" },
            { value: "datePicker", label: "Date Picker" },
        ],
    },
];

const defaultValues: Partial<QuestionBankForm> = {
    //section: 1,
    title: "",
    type: "textInput",
    description: "",
};

const validationSchema = yup.object({
    title: yup.string().optional().label("Question Title"),
    //type: yup.string().required().label("Question Type"),
});

const TestPage2 = () => {
    const { control, handleSubmit, formState, reset, watch } =
        useForm<QuestionBankForm>({
            mode: "onTouched",
            resolver: yupResolver(validationSchema),
            defaultValues: defaultValues,
        });

    const createQuestion = usePost<QuestionBank>(
        `${apis.questionBankUrl}/question`,
        {
            itemName: "QuestionBank",
        }
    );

    const submitForm = async (formData: QuestionBankForm) => {
        const payload = { question_json: JSON.stringify(formData) };
        console.log(payload);
        //const response = await createQuestion(payload);
        //console.log(response);
    };

    return (
        <>
            <Header />
            <Container
                sx={{
                    display: "grid",
                    gridTemplateColumns: "2fr 1fr",
                    gap: 2,
                    height: "1000px",
                }}>
                <Paper sx={{ mx: 1, px: 2 }}>
                    <h2>Create a new question</h2>
                    <Container>
                        <Paper
                            sx={{
                                marginBottom: 1,
                                gridColumn: "span 2",
                            }}>
                            <Box padding={0}>
                                <Form
                                    sx={{ maxWidth: 1000 }}
                                    onSubmit={handleSubmit(submitForm)}>
                                    {formFields.map(field => (
                                        <InputWrapper
                                            key={field.name}
                                            control={control}
                                            {...field}
                                        />
                                    ))}

                                    <Box
                                        sx={{
                                            p: 0,
                                            display: "flex",
                                            justifyContent: "end",
                                        }}>
                                        <Button type="submit">Create</Button>
                                    </Box>
                                </Form>
                            </Box>
                        </Paper>
                    </Container>
                </Paper>
            </Container>
        </>
    );
};

interface RenderQuestionProps {
    id: number;
}

const RenderQuestion = ({ id }: RenderQuestionProps) => {
    const { data, isLoading } = useGet<QuestionBank>(
        `${apis.questionBankUrl}/question/${id}`,
        {
            itemName: "QuestionBank",
        }
    );

    const { control, setValue } = useForm<QuestionBankForm>({
        mode: "onTouched",
        //resolver: getValidation(data),
        //defaultValues: defaultValues,
    });

    if (isLoading || data == undefined) return null;

    const question = data?.question_json;

    const { name, validation } = question;

    const defaultValues = {
        [name]: data?.default,
    };

    const { field } = question;

    return (
        <Paper sx={{ mx: 1, px: 2 }}>
            <h2>{question?.title}</h2>
            <Container>
                <Paper
                    sx={{
                        marginBottom: 1,
                        gridColumn: "span 2",
                    }}>
                    <Box padding={0}>{question?.description}</Box>
                    <Box padding={0}>
                        <InputWrapper
                            horizontalForm={false}
                            control={control}
                            setValue={setValue}
                            {...field}
                        />
                    </Box>
                </Paper>
            </Container>
        </Paper>
    );

    ///     if (!name) return yupResolver(yup.object({}));

    /*let schema = yup;

    for (const [key, value] of Object.entries(validation)) {
        console.log(`${key}: ${value}`);
    }*/

    //yupResolver(yup.object({ [name]: schema }));
};

const TestPage = () => {
    return (
        <>
            <Header />
            <Container
                sx={{
                    display: "grid",
                    gridTemplateColumns: "2fr 1fr",
                    gap: 2,
                    height: "1000px",
                }}>
                <RenderQuestion id={5} />
            </Container>
        </>
    );
};

export default TestPage;
