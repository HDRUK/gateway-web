import Form from "@/components/Form";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";

import Button from "@/components/Button";
import {
    applicationDefaultValues,
    applicationEditFormFields,
    applicationValidationSchema,
} from "@/config/forms/application";
import InputWrapper from "@/components/InputWrapper";
import { Application } from "@/interfaces/Application";
import DeleteApplication from "@/modules/DeleteApplication";
import apis from "@/config/apis";
import Loading from "@/components/Loading";
import usePut from "@/hooks/usePut";
import { useEffect } from "react";
import Paper from "@/components/Paper";
import { useRouter } from "next/router";

interface EditApplicationFormProps {
    application?: Application;
    isTabView?: boolean;
}

const EditApplicationForm = ({
    application,
    isTabView = true,
}: EditApplicationFormProps) => {
    const { query, push } = useRouter();

    const { control, handleSubmit, getValues, reset, setValue, trigger } =
        useForm<Application>({
            resolver: yupResolver(applicationValidationSchema),
            defaultValues: {
                ...applicationDefaultValues,
                ...application,
            },
        });

    useEffect(() => {
        reset(application);
    }, [application, reset]);

    const fields = isTabView
        ? applicationEditFormFields
        : applicationEditFormFields.filter(field => field.name !== "enabled");

    const updateApplication = usePut<Application>(`${apis.applicationsV1Url}`, {
        itemName: "Application",
    });

    const submitForm = async (formData: Application) => {
        const payload = { ...applicationDefaultValues, ...formData };
        await updateApplication(payload.id, payload);
        if (!isTabView) {
            push(
                `/account/team/${query.teamId}/integrations/api-management/create/${payload.id}/permissions`
            );
        }
    };

    if (!application) return <Loading />;

    return (
        <>
            <Form onSubmit={handleSubmit(submitForm)}>
                <Paper
                    sx={{
                        marginBottom: "10px",
                        padding: 2,
                    }}>
                    {fields.map(field => (
                        <InputWrapper
                            getValues={getValues}
                            setValue={setValue}
                            trigger={trigger}
                            key={field.name}
                            control={control}
                            {...field}
                        />
                    ))}
                </Paper>
                <Paper
                    sx={{
                        display: "flex",
                        justifyContent: "end",
                        marginBottom: "10px",
                        padding: 2,
                    }}>
                    <Button type="submit">
                        {isTabView ? "Save changes" : "Save & Continue"}
                    </Button>
                </Paper>
            </Form>
            <Paper
                sx={{
                    padding: 2,
                }}>
                <DeleteApplication control={control} />
            </Paper>
        </>
    );
};

EditApplicationForm.defaultProps = {
    application: {},
};

export default EditApplicationForm;
