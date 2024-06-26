"use client";

import { useMemo } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { Typography } from "@mui/material";
import MuiDialogActions from "@mui/material/DialogActions";
import MuiDialogContent from "@mui/material/DialogContent";
import { useTranslations } from "next-intl";
import pLimit from "p-limit";
import { AddTeamMember, UserAndRoles } from "@/interfaces/AddTeamMember";
import { User } from "@/interfaces/User";
import Box from "@/components/Box";
import Dialog from "@/components/Dialog";
import ModalButtons from "@/components/ModalButtons";
import useAuth from "@/hooks/useAuth";
import useDialog from "@/hooks/useDialog";
import useGet from "@/hooks/useGet";
import useGetTeam from "@/hooks/useGetTeam";
import usePost from "@/hooks/usePost";
import notificationService from "@/services/notification";
import apis from "@/config/apis";
import {
    addTeamMemberDefaultValues,
    addTeamMemberValidationSchema,
} from "@/config/forms/addTeamMember";
import { getPermissions } from "@/utils/permissions";
import { getTeamUser } from "@/utils/user";
import AddTeamMemberRows from "../AddTeamMemberRows";
import { getAvailableUsers } from "./AddTeamMemberDialog.utils";

const limit = pLimit(1);

const AddTeamMemberDialog = () => {
    const { user } = useAuth();
    const { hideDialog, store } = useDialog();
    const { dialogProps } = store as unknown as {
        dialogProps: {
            teamId: string;
            onSuccess: (userIds: number[]) => void;
        };
    };

    const t = useTranslations("modules");
    const { control, handleSubmit } = useForm<AddTeamMember>({
        resolver: yupResolver(addTeamMemberValidationSchema),
        defaultValues: { ...addTeamMemberDefaultValues },
    });

    const { fields, append, remove } = useFieldArray({
        control,
        name: "userAndRoles",
    });

    const { data: users = [] } = useGet<User[]>(apis.usersV1Url);

    const { team } = useGetTeam(dialogProps.teamId);

    const teamUser = team && user && getTeamUser(team?.users, user?.id);
    const permissions = getPermissions(user?.roles, teamUser?.roles);

    const userOptions = useMemo(() => {
        if (!team) return [];
        return getAvailableUsers(team.users, users);
    }, [team, users]);

    const addTeamMember = usePost<UserAndRoles>(
        `${apis.teamsV1Url}/${dialogProps.teamId}/users`,
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
        if (typeof dialogProps?.onSuccess === "function") {
            /* send userIds back to parent component to be able to list new Team Members at the top */
            dialogProps.onSuccess(
                userAndRoles.map(userAndRole => userAndRole.userId as number)
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
                        userPermissions={permissions}
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
