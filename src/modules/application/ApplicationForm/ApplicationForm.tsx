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
// import useGet from "@/hooks/useGet";
import { useEffect, useMemo } from "react";
import usePost from "@/hooks/usePost";
import { Application } from "@/interfaces/Application";
import DeleteApplication from "@/modules/application/DeleteApplication";
// import Loading from "@/components/Loading";
import useAuth from "@/hooks/useAuth";
import apis from "@/config/apis";

const ApplicationForm = () => {
    const { user } = useAuth();

    const updateApplication = usePost<Application>(`${apis.applicationsV1Url}`, {
        itemName: "Application",
    });

    const hydratedFormFields = useMemo(
        () =>
            applicationFormFields.map(field => {
                return field;
            }),
            []
    );

    const { control, handleSubmit, getValues } = useForm<Application>({
        resolver: yupResolver(applicationValidationSchema),
        defaultValues: { ...applicationDefaultValues },
    });

    const submitForm = (formData: Application) => {
        updateApplication({ ...applicationDefaultValues, ...formData });
    };

    // useEffect(() => {
    //     if (!application) {
    //         return;
    //     }
    //     reset(application);
    // }, [reset, application]);

    return (
        <>
            <Box
                sx={{
                    display: "flex",
                }}>
                <Form sx={{ maxWidth: 1000 }} onSubmit={handleSubmit(submitForm)}>
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

export default ApplicationForm;