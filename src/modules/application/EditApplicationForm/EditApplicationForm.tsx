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
import { Application } from "@/interfaces/Application";
import DeleteApplication from "@/modules/application/DeleteApplication";
import apis from "@/config/apis";
import Loading from "@/components/Loading";
import usePut from "@/hooks/usePut";
import { useEffect } from "react";
import { Divider } from "@mui/material";

interface EditApplicationFormProps {
    application?: Application;
}

const EditApplicationForm = ({ application }: EditApplicationFormProps) => {
    const { control, handleSubmit, getValues, reset } = useForm<Application>({
        resolver: yupResolver(applicationValidationSchema),
        defaultValues: {
            ...applicationDefaultValues,
            ...application,
        },
    });

    useEffect(() => {
        reset(application);
    }, [application, reset]);

    const updateApplication = usePut<Application>(`${apis.applicationsV1Url}`, {
        itemName: "Application",
    });

    const submitForm = (formData: Application) => {
        updateApplication({ ...applicationDefaultValues, ...formData });
    };

    if (!application) return <Loading />;

    return (
        <>
            <Box>
                <Form
                    sx={{ maxWidth: 1000 }}
                    onSubmit={handleSubmit(submitForm)}>
                    {applicationFormFields.map(field => (
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
                <Divider />
                <DeleteApplication control={control} />
            </Box>
        </>
    );
};

EditApplicationForm.defaultProps = {
    application: {},
};

export default EditApplicationForm;
