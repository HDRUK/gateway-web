import MuiDialogContent from "@mui/material/DialogContent";
import { useTranslation } from "react-i18next";
import { useFieldArray, useForm } from "react-hook-form";
import Dialog from "@/components/Dialog";
import MuiDialogActions from "@mui/material/DialogActions";
import ModalButtons from "@/components/ModalButtons";
import Box from "@/components/Box";
import pLimit from "p-limit";
import { AddTeamMember } from "@/interfaces/AddTeamMember";
import { IconButton, Typography } from "@mui/material";
import apis from "@/config/apis";
import Loading from "@/components/Loading";
import useGet from "@/hooks/useGet";
import { AddIcon, RemoveIcon, SearchRoundedIcon } from "@/consts/icons";
import { User } from "@/interfaces/User";
import {
    addTeamMemberFormFields,
    addTeamMemberDefaultValues,
    addTeamMemberValidationSchema,
} from "@/config/forms/addTeamMember";
import InputWrapper from "@/components/InputWrapper";
import { yupResolver } from "@hookform/resolvers/yup";
import usePost from "@/hooks/usePost";
import { useRouter } from "next/router";
import { ROLE_CUSTODIAN_DAR_REVIEWER } from "@/consts/roles";
import { AccountTeamUrlQuery } from "@/interfaces/AccountTeamQuery";
import notificationService from "@/services/notification";

const limit = pLimit(1);

const AddTeamMemberDialog = () => {
    const { query } = useRouter();
    const { teamId } = query as AccountTeamUrlQuery;
    const { t } = useTranslation("modules");
    const { control, handleSubmit } = useForm<AddTeamMember>({
        // resolver: yupResolver(addTeamMemberValidationSchema),
        defaultValues: { ...addTeamMemberDefaultValues },
    });

    const { fields, append, remove } = useFieldArray({
        control,
        name: "userAndRoles",
    });

    const addTeamMember = usePost<AddTeamMember>(
        `${apis.teamsV1Url}/${teamId}/users`,
        { successNotificationsOn: false }
    );

    const { data: users = [], isLoading: isTeamListLoading } = useGet<User[]>(
        apis.usersV1Url
    );

    if (isTeamListLoading) return <Loading />;

    const [userField, memberField] = addTeamMemberFormFields;

    const onFormSubmit = async (usersToAdd: AddTeamMember[]) => {
        const fakePayload = [
            { userId: 18, roles: [ROLE_CUSTODIAN_DAR_REVIEWER] },
            { userId: 2340, roles: [ROLE_CUSTODIAN_DAR_REVIEWER] },
        ];
        const promises = fakePayload.map(async payload => {
            await limit(() => addTeamMember(payload));
        });

        const results = await Promise.allSettled(promises);

        const success = results.filter(result => result.status === "fulfilled");

        if (success.length > 0) {
            notificationService.success(
                `${success.length} new member(s) successfully added to the team`
            );
        }

        console.log("results: ", results);
    };

    return (
        <Dialog title={t("dialogs.AddTeamMemberDialog.title")}>
            <Box onSubmit={handleSubmit(onFormSubmit)} component="form">
                <MuiDialogContent>
                    <Typography>
                        Users that you want to add to your team must already
                        have an account on the Gateway
                    </Typography>
                    <Box
                        sx={{
                            p: 0,
                            display: "flex",
                        }}>
                        {fields.map((field, index) => {
                            console.log("field: ", field);
                            return (
                                <div key={field.id}>
                                    <InputWrapper
                                        {...userField}
                                        name={`userAndRoles.${index}.userId`}
                                        value={field.userId}
                                        control={control}
                                        icon={SearchRoundedIcon}
                                        options={[users].map(user => ({
                                            value: user.id,
                                            label: user.name,
                                        }))}
                                    />
                                    <InputWrapper
                                        {...memberField}
                                        value={field.roles}
                                        name={`userAndRoles.${index}.roles`}
                                        control={control}
                                    />

                                    {fields.length > 1 && (
                                        <IconButton
                                            disableRipple
                                            size="large"
                                            edge="start"
                                            aria-label="Remove row"
                                            onClick={() => remove(field.id)}>
                                            <RemoveIcon />
                                        </IconButton>
                                    )}
                                    <IconButton
                                        disableRipple
                                        size="large"
                                        edge="start"
                                        aria-label="Remove row"
                                        onClick={() =>
                                            append({
                                                userId: null,
                                                roles: [],
                                            })
                                        }>
                                        <AddIcon />
                                    </IconButton>
                                </div>
                            );
                        })}
                    </Box>
                </MuiDialogContent>
                <MuiDialogActions>
                    <ModalButtons
                        confirmText={
                            t("dialogs.AddTeamMemberDialog.confirmButton") || ""
                        }
                        confirmType="submit"
                        cancelText={
                            t("dialogs.AddTeamMemberDialog.cancelButton") || ""
                        }
                    />
                </MuiDialogActions>
            </Box>
        </Dialog>
    );
};

export default AddTeamMemberDialog;
