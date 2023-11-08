import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/router";
import useAuth from "@/hooks/useAuth";
import useActionBar from "@/hooks/useActionBar";
import apis from "@/config/apis";
import Table from "@/components/Table";
import { getColumns } from "@/config/tables/teamManagement";
import {
    RolesPayload,
    getChangeCount,
    getDifferences,
} from "@/utils/userRoles";
import { User } from "@/interfaces/User";
import pLimit from "p-limit";
import notificationService from "@/services/notification";

import useDelete from "@/hooks/useDelete";
import useModal from "@/hooks/useModal";
import { useHasPermissions } from "@/hooks/useHasPermission";
import { useSWRConfig } from "swr";
import { useUnsavedChanges } from "@/hooks/useUnsavedChanges";
import usePut from "@/hooks/usePut";
import { DeleteForeverIcon } from "@/consts/icons";
import ChangesActionBar from "@/modules/ChangesActionBar";
import useGetTeam from "@/hooks/useGetTeam";
import { AccountTeamUrlQuery } from "@/interfaces/AccountTeamQuery";
import Paper from "@/components/Paper";

const limit = pLimit(1);

interface TeamMembersProps {
    teamMembers: User[];
}

const TeamMembers = ({ teamMembers }: TeamMembersProps) => {
    const permissions = useHasPermissions();
    const { user } = useAuth();
    const { showModal } = useModal();
    const { mutate: mututeUser } = useSWRConfig();

    const { query } = useRouter();
    const { teamId } = query as AccountTeamUrlQuery;

    const { mutateTeam } = useGetTeam(teamId);
    const [rolesToUpdate, setRolesToUpdate] = useState<RolesPayload[] | null>(
        null
    );
    const [tableRows, setTableRows] = useState<User[]>([]);
    const [shouldSubmit, setShouldSubmit] = useState<boolean>(false);

    const updateMembers = usePut<{ id?: number | undefined }>(
        `${apis.teamsV1Url}/${teamId}/users`,
        {
            shouldFetch: false,
            errorNotificationsOn: false,
            successNotificationsOn: false,
        }
    );

    const { showBar, hideBar } = useActionBar();

    const submitForm = useCallback(async () => {
        if (!rolesToUpdate) return;
        const updatingOwnPermissions = !!rolesToUpdate.find(
            role => role.userId === user?.id
        );
        const promises = rolesToUpdate.map(async payload => {
            await limit(() =>
                updateMembers(payload.userId, { roles: payload.roles })
            );
        });

        const results = await Promise.allSettled(promises);
        const success = results.filter(result => result.status === "fulfilled");
        const error = results.filter(result => result.status === "rejected");

        if (success.length > 0) {
            notificationService.success(
                `${success.length} member(s) have been successfully updated`
            );
        }
        if (error.length > 0) {
            notificationService.error(
                `${error.length} member(s) were not updated`
            );
        }

        mutateTeam();
        setRolesToUpdate(null);
        hideBar();

        if (updatingOwnPermissions) {
            mututeUser(apis.authInternalUrl);
        }
    }, [
        hideBar,
        mutateTeam,
        mututeUser,
        rolesToUpdate,
        updateMembers,
        user?.id,
    ]);

    const discardChanges = () => {
        setTableRows(teamMembers || []);
        hideBar();
        setRolesToUpdate(null);
    };

    useUnsavedChanges({
        shouldConfirmLeave: !!rolesToUpdate,
        onSuccess: submitForm,
        onCancel: discardChanges,
        modalProps: {
            cancelText: "No",
            confirmText: "Yes",
            title: "Do you want to save your changes?",
        },
    });

    const deleteTeamMember = useDelete(`${apis.teamsV1Url}/${teamId}`, {
        itemName: `Team member`,
    });

    useEffect(() => {
        if (teamMembers) setTableRows(teamMembers);
    }, [teamMembers]);

    const actions = useMemo(
        () => [
            {
                icon: <DeleteForeverIcon color="primary" />,
                onClick: (rowUser: User) =>
                    showModal({
                        confirmText: "Remove",
                        title: "Delete a user",
                        content: `Are you sure you want to remove ${rowUser.firstname}  ${rowUser.lastname}?`,
                        onSuccess: async () => {
                            deleteTeamMember(`users/${rowUser.id}`);
                            mutateTeam();
                        },
                    }),
            },
        ],
        [deleteTeamMember, mutateTeam, showModal]
    );

    useEffect(() => {
        if (!shouldSubmit) return;
        showModal({
            confirmText: "Save update",
            cancelText: "No, nevermind",
            title: "Roles update(s)",
            content:
                "Are you sure you want to save your update to the team role(s)?",
            onSuccess: () => {
                submitForm();
                setShouldSubmit(false);
            },
            onCancel: () => {
                setShouldSubmit(false);
            },
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [shouldSubmit]);

    const columns = useMemo(() => {
        return getColumns(permissions, actions);
    }, [actions, permissions]);

    const handleUpdate = async (updatedUsers: User[]) => {
        setTableRows(updatedUsers);
        const { changedRoles, allRoles } = getDifferences(
            updatedUsers,
            teamMembers
        );
        const changeCount = getChangeCount(changedRoles);
        setRolesToUpdate(allRoles);

        hideBar();

        if (changedRoles.length > 0) {
            showBar("TeamMembers", {
                component: ChangesActionBar,
                cancelText: "Discard",
                confirmText: "Save",
                changeCount,
                onSuccess: () => {
                    setShouldSubmit(true);
                },
                onCancel: () => {
                    discardChanges();
                },
            });
        }
    };

    return (
        <Paper>
            <Table<User>
                columns={columns}
                onUpdate={handleUpdate}
                rows={tableRows}
            />
        </Paper>
    );
};

export default TeamMembers;
