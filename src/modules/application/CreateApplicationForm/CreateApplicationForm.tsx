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

const CreateApplicationForm = () => {
    const { user } = useAuth();
    const { query, push } = useRouter();
    const { control, handleSubmit, getValues } = useForm<Application>({
        resolver: yupResolver(applicationValidationSchema),
        defaultValues: {
            user_id: user?.id,
            team_id: parseInt(query.teamId as string, 10),
            ...applicationDefaultValues,
        },
    });

    const updateApplication = usePost<Application>(
        `${apis.applicationsV1Url}`,
        {
            itemName: "Application",
        }
    );

    const submitForm = async (formData: Application) => {
        await updateApplication({ ...applicationDefaultValues, ...formData });
        push(`/account/team/${query.teamId}/integrations/api-management`);
    };

    return (
        <Box>
            <Form sx={{ maxWidth: 1000 }} onSubmit={handleSubmit(submitForm)}>
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
                    <Button type="submit">Create</Button>
                </Box>
            </Form>
        </Box>
    );
};

export default CreateApplicationForm;
