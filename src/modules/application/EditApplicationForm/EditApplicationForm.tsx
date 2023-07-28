import Box from "@/components/Box";
import Form from "@/components/Form";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";

import Button from "@/components/Button";
import {
    applicationDefaultValues,
    applicationFormFields,
    applicationValidationSchema,
} from "@/config/forms/application";
import InputWrapper from "@/components/InputWrapper";
import { useEffect, useMemo } from "react";
import { Application } from "@/interfaces/Application";
import DeleteApplication from "@/modules/application/DeleteApplication";
import apis from "@/config/apis";
import Loading from "@/components/Loading";
import usePut from "@/hooks/usePut";

interface EditApplicationFormProps {
    application: Application,
};

const EditApplicationForm = (application: EditApplicationFormProps) => {
    const hydratedFormFields = useMemo(
        () =>
            applicationFormFields.map(field => {
                return field;
            }),
        []
    );

    const { control, handleSubmit, getValues } = useForm<Application>({
        resolver: yupResolver(applicationValidationSchema),
        defaultValues: { ...applicationDefaultValues, ...application.application },
    });

    const submitForm = (formData: Application) => {
        updateApplication({ ...applicationDefaultValues, ...formData });
    };

    const updateApplication = usePut<Application>(
        `${apis.applicationsV1Url}`,
        {
            itemName: "Application",
        }
    );

    useEffect(() => {
        if (!application) {
            return;
        }

    }, [application]);

    if (!application) return <Loading />;

    return (
        <>
            <Box>
                <Form
                    sx={{ maxWidth: 1000 }}
                    onSubmit={handleSubmit(submitForm)}>
                    {hydratedFormFields.map(field => (
                        <InputWrapper
                            getValues={getValues}
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
                            marginBottom: "10px",
                        }}>
                        <Button type="submit">Save changes</Button>
                    </Box>
                </Form>
            </Box>
            <Box>
                <DeleteApplication control={control} />
            </Box>
        </>
    );
};

export default EditApplicationForm;
