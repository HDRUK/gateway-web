"use client";

import { useMemo } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { TeamForm } from "@/interfaces/Team";
import { User } from "@/interfaces/User";
import Box from "@/components/Box";
import Button from "@/components/Button";
import Form from "@/components/Form";
import InputWrapper from "@/components/InputWrapper";
import Paper from "@/components/Paper";
import useGet from "@/hooks/useGet";
import usePost from "@/hooks/usePost";
import { useUnsavedChanges } from "@/hooks/useUnsavedChanges";
import apis from "@/config/apis";
import {
    teamDefaultValues,
    teamFormFields,
    teamValidationSchema,
} from "@/config/forms/team";
import routes from "@/consts/routes";

const CreateIntegrationForm = () => {
    const t = useTranslations("common");

    const { push } = useRouter();

    const { data: users = [] } = useGet<User[]>(apis.usersV1Url);

    const { control, handleSubmit, formState, reset } = useForm<TeamForm>({
        mode: "onTouched",
        resolver: yupResolver(teamValidationSchema),
        defaultValues: teamDefaultValues,
    });

    useUnsavedChanges({
        shouldConfirmLeave: formState.isDirty && !formState.isSubmitSuccessful,
    });

    const createTeam = usePost<TeamForm>(apis.teamsV1Url, {
        itemName: "Team",
    });

    const submitForm = async (formData: TeamForm) => {
        await createTeam({
            ...teamDefaultValues,
            ...formData,
        });

        setTimeout(() => {
            push(routes.ACCOUNT_TEAMS);
        });
    };

    const hydratedFormFields = useMemo(
        () =>
            teamFormFields.map(field => {
                if (field.name === "notifications") {
                    return {
                        ...field,
                        options: users?.map(user => ({
                            value: user.email,
                            label: `${user.firstname} ${user.lastname}`,
                        })),
                    };
                }
                return field;
            }),
        [users]
    );

    return (
        <Form sx={{ maxWidth: 1000 }} onSubmit={handleSubmit(submitForm)}>
            <Paper sx={{ marginBottom: 1, gridColumn: "span 2" }}>
                <Box padding={0}>
                    {hydratedFormFields.map(field => (
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
                    padding={0}
                    display="flex"
                    justifyContent="space-between"
                    marginBottom={10}>
                    <Button
                        color="secondary"
                        variant="outlined"
                        onClick={() => reset(teamDefaultValues)}>
                        {t("cancel")}
                    </Button>
                    <Button type="submit"> {t("publish")}</Button>
                </Box>
            </Paper>
        </Form>
    );
};

export default CreateIntegrationForm;
