import MuiDialogContent from "@mui/material/DialogContent";
import { useTranslation } from "react-i18next";
import { useFieldArray, useForm } from "react-hook-form";
import Dialog from "@/components/Dialog";
import MuiDialogActions from "@mui/material/DialogActions";
import ModalButtons from "@/components/ModalButtons";
import Box from "@/components/Box";
import pLimit from "p-limit";
import { AddTeamMember, UserAndRoles } from "@/interfaces/AddTeamMember";
import { Typography } from "@mui/material";
import apis from "@/config/apis";
import useGet from "@/hooks/useGet";
import { User } from "@/interfaces/User";
import {
    addTeamMemberDefaultValues,
    addTeamMemberValidationSchema,
} from "@/config/forms/addTeamMember";
import { yupResolver } from "@hookform/resolvers/yup";
import usePost from "@/hooks/usePost";
import { useRouter } from "next/router";
import { AccountTeamUrlQuery } from "@/interfaces/AccountTeamQuery";
import notificationService from "@/services/notification";
import useGetTeam from "@/hooks/useGetTeam";
import { useMemo } from "react";
import AddTeamMemberRows from "@/modules/AddTeamMemberRows";
import useDialog from "@/hooks/useDialog";
import { getAvailableUsers } from "./AddTeamMemberDialog.utils";

const limit = pLimit(1);

const AddTeamMemberDialog = () => {
    const { hideDialog, store } = useDialog();
    const { query } = useRouter();
    const { teamId } = query as AccountTeamUrlQuery;
    const { t } = useTranslation("modules");
    const { control, handleSubmit } = useForm<AddTeamMember>({
        resolver: yupResolver(addTeamMemberValidationSchema),
        defaultValues: { ...addTeamMemberDefaultValues },
    });

    const { fields, append, remove } = useFieldArray({
        control,
        name: "userAndRoles",
    });

    const { data: users = [] } = useGet<User[]>(apis.usersV1Url);

    const { team } = useGetTeam(teamId);

    const userOptions = useMemo(() => {
        if (!team) return [];
        return getAvailableUsers(team.users, users);
    }, [team, users]);

    const addTeamMember = usePost<UserAndRoles>(
        `${apis.teamsV1Url}/${teamId}/users`,
        { successNotificationsOn: false }
    );

    const onFormSubmit = async (formData: AddTeamMember) => {
        const { userAndRoles } = formData;

        hideDialog();

        const promises = userAndRoles.map(async payload => {
            await limit(() => addTeamMember(payload));
        });

        const results = await Promise.allSettled(promises);

        const success = results.filter(result => result.status === "fulfilled");

        if (success.length > 0) {
            notificationService.success(
                `${success.length} new member(s) successfully added to the team`
            );
        }
        if (typeof store.dialogProps?.onSuccess === "function") {
            /* send userIds back to parent component to be able to list new Team Members at the top */
            store.dialogProps.onSuccess(
                userAndRoles.map(userAndRole => userAndRole.userId)
            );
        }
    };

    return (
        <Dialog title={t("dialogs.AddTeamMemberDialog.title")}>
            <Box
                sx={{ p: 0 }}
                onSubmit={handleSubmit(onFormSubmit)}
                component="form">
                <MuiDialogContent>
                    <Typography sx={{ mb: 2 }}>
                        Users that you want to add to your team must already
                        have an account on the Gateway
                    </Typography>
                    <AddTeamMemberRows
                        fields={fields}
                        append={append}
                        remove={remove}
                        control={control}
                        userOptions={userOptions}
                    />
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
