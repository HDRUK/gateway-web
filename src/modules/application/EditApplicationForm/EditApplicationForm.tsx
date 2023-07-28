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
import { useEffect, useMemo, useState } from "react";
import { Application } from "@/interfaces/Application";
import DeleteApplication from "@/modules/application/DeleteApplication";
import useAuth from "@/hooks/useAuth";
import apis from "@/config/apis";
import { useRouter } from "next/router";
import useGet from "@/hooks/useGet";
import Loading from "@/components/Loading";
import usePut from "@/hooks/usePut";

interface EditApplicationFormProps {
    application: Application,
};

const EditApplicationForm = (application: EditApplicationFormProps) => {
    // const { user } = useAuth();
    // const router = useRouter();
    // const { id, teamId } = router.query;

    // const { data: application, isLoading: isApplicationLoading } =
    //     useGet<Application>(`${apis.applicationsV1Url}/${id}`);

    const hydratedFormFields = useMemo(
        () =>
            applicationFormFields.map(field => {
                return field;
            }),
        []
    );

    // const [ applicationStatus, setApplicationStatus ] = useState(false);

    const { control, handleSubmit, getValues } = useForm<Application>({
        resolver: yupResolver(applicationValidationSchema),
        defaultValues: { ...applicationDefaultValues, ...application.application },
    });

    const submitForm = (formData: Application) => {
        updateApplication({ ...applicationDefaultValues, ...formData });
    };

    // const handleApplicationStatusChange = (checked: boolean) => {
    //     setApplicationStatus(checked);
    // };

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

    console.log(application);

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
