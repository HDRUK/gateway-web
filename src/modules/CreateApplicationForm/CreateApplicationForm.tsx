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
import apis from "@/config/apis";
import { useRouter } from "next/router";
import usePost from "@/hooks/usePost";
import useAuth from "@/hooks/useAuth";
import Paper from "@/components/Paper";
import { useMemo } from "react";
import { useUnsavedChanges } from "@/hooks/useUnsavedChanges";

const CreateApplicationForm = () => {
    const { user } = useAuth();
    const { query, push } = useRouter();

    const defaultValues = useMemo(() => {
        return {
            user_id: user?.id,
            team_id: parseInt(query.teamId as string, 10),
            ...applicationDefaultValues,
        };
    }, [query.teamId, user?.id]);

    const { control, handleSubmit, reset, formState } = useForm<Application>({
        mode: "onTouched",
        resolver: yupResolver(applicationValidationSchema),
        defaultValues,
    });

    useUnsavedChanges({
        shouldConfirmLeave: formState.isDirty && !formState.isSubmitSuccessful,
    });

    const updateApplication = usePost<Application>(
        `${apis.applicationsV1Url}`,
        {
            itemName: "Application",
        }
    );

    const submitForm = async (formData: Application) => {
        const response = await updateApplication({
            ...applicationDefaultValues,
            ...formData,
        });

        /* setTimout required to prevent useUnsavedChanges hook firing before formState updates */
        setTimeout(() => {
            push(
                `/account/team/${query.teamId}/integrations/api-management/create/${response.id}/permissions`
            );
        });
    };

    return (
        <Form sx={{ maxWidth: 1000 }} onSubmit={handleSubmit(submitForm)}>
            <Paper sx={{ marginBottom: 1 }}>
                <Box>
                    {applicationFormFields.map(field => (
                        <InputWrapper
                            key={field.name}
                            control={control}
                            {...field}
                        />
                    ))}
                </Box>
            </Paper>
            <Paper>
                <Box
                    sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        marginBottom: "10px",
                    }}>
                    <Button
                        onClick={() => reset(defaultValues)}
                        color="secondary"
                        variant="outlined">
                        Discard API
                    </Button>
                    <Button type="submit">Save &amp; Continue</Button>
                </Box>
            </Paper>
        </Form>
    );
};

export default CreateApplicationForm;
