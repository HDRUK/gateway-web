import Box from "@/components/Box";
import Form from "@/components/Form";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";

import Button from "@/components/Button";
import {
    integrationDefaultValues,
    integrationFormFields,
    integrationValidationSchema,
} from "@/config/forms/integration";
import InputWrapper from "@/components/InputWrapper";
import { Application } from "@/interfaces/Application";
import apis from "@/config/apis";
import { useRouter } from "next/router";
import usePost from "@/hooks/usePost";
import useAuth from "@/hooks/useAuth";
import Paper from "@/components/Paper";
import { useMemo } from "react";
import { useUnsavedChanges } from "@/hooks/useUnsavedChanges";

const CreateIntegrationForm = () => {
    const { user } = useAuth();
    const { query } = useRouter();

    const defaultValues = useMemo(() => {
        return {
            user_id: user?.id,
            team_id: parseInt(query.teamId as string, 10),
            ...integrationDefaultValues,
        };
    }, [query.teamId, user?.id]);

    const { control, handleSubmit, formState } = useForm<Application>({
        mode: "onTouched",
        resolver: yupResolver(integrationValidationSchema),
        defaultValues,
    });

    useUnsavedChanges({
        shouldConfirmLeave: formState.isDirty && !formState.isSubmitSuccessful,
    });

    const createIntegration = usePost<Application>(
        `${apis.applicationsV1Url}`,
        {
            itemName: "Integration",
        }
    );

    const submitForm = async (formData: Application) => {
        await createIntegration({
            ...integrationDefaultValues,
            ...formData,
        });
    };

    return (
        <Form sx={{ maxWidth: 1000 }} onSubmit={handleSubmit(submitForm)}>
            <Paper sx={{ marginBottom: 1 }}>
                <Box padding={0}>
                    {integrationFormFields.map(field => (
                        <InputWrapper
                            key={field.name}
                            horizontalForm
                            control={control}
                            {...field}
                        />
                    ))}
                </Box>
            </Paper>
            <Paper>
                <Box
                    padding={0}
                    display="flex"
                    justifyContent="space-between"
                    marginBottom={10}
                    // sx={{
                    //     display: "flex",
                    //     justifyContent: "space-between",
                    //     marginBottom: "10px",
                    // }}
                >
                    <Button type="submit">Save configuration</Button>
                </Box>
            </Paper>
        </Form>
    );
};

export default CreateIntegrationForm;
