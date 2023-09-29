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

const CreateApplicationForm = () => {
    const { user } = useAuth();
    const { query, push } = useRouter();
    const { control, handleSubmit, getValues, setValue, trigger } =
        useForm<Application>({
            mode: "onTouched",
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
        const response = await updateApplication({
            ...applicationDefaultValues,
            ...formData,
        });
        console.log("response: ", response);
        push(
            `/account/team/${query.teamId}/integrations/api-management/list/${response.id}`
        );
    };

    return (
        <Form sx={{ maxWidth: 1000 }} onSubmit={handleSubmit(submitForm)}>
            <Paper sx={{ marginBottom: 1 }}>
                <Box>
                    {applicationFormFields.map(field => (
                        <InputWrapper
                            getValues={getValues}
                            setValue={setValue}
                            trigger={trigger}
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
                    <Button type="submit" color="secondary" variant="outlined">
                        Discard API
                    </Button>
                    <Button type="submit">Save &amp; Continue</Button>
                </Box>
            </Paper>
        </Form>
    );
};

export default CreateApplicationForm;
