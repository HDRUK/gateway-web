import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/router";
import useAuth from "@/hooks/useAuth";
import useActionBar from "@/hooks/useActionBar";
import Loading from "@/components/Loading";
import apis from "@/config/apis";
import useGet from "@/hooks/useGet";
import Table from "@/components/Table";
import { getColumns } from "@/config/tables/teamManagement";
import {
    RolesPayload,
    getChangeCount,
    getDifferences,
} from "@/utils/userRoles";
import { User } from "@/interfaces/User";
import { Team } from "@/interfaces/Team";
import pLimit from "p-limit";
import notificationService from "@/services/notification";

import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import useDelete from "@/hooks/useDelete";
import useModal from "@/hooks/useModal";
import TeamMembersActionBar from "@/modules/TeamMembersActionBar";
import { useHasPermissions } from "@/hooks/useHasPermission";
import { useSWRConfig } from "swr";
import { useUnsavedChanges } from "@/hooks/useUnsavedChanges";
import usePut from "@/hooks/usePut";

const limit = pLimit(1);

const TeamMembers = () => {
    const permissions = useHasPermissions();
    const { user } = useAuth();

    const { showModal } = useModal();
    const { mutate: mututeUser } = useSWRConfig();

    const router = useRouter();
    const { teamId } = router.query;

    const [rolesToUpdate, setRolesToUpdate] = useState<RolesPayload[] | null>(
        null
    );
    const [data, setData] = useState<User[]>([]);
    const [shouldSubmit, setShouldSubmit] = useState<boolean>(false);

    const {
        data: team,
        isLoading: isTeamListLoading,
        mutate,
    } = useGet<Team>(`${apis.teamsV1Url}/${teamId}`);

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
                `${success.length} member roles(s) have been successfully updated`
            );
        }
        if (error.length > 0) {
            notificationService.error(
                `${error.length} member roles(s) were not updated`
            );
        }

        mutate();
        setRolesToUpdate(null);
        hideBar();

        if (updatingOwnPermissions) {
            mututeUser(apis.authInternalUrl);
        }
    }, [hideBar, mutate, mututeUser, rolesToUpdate, teamId, user?.id]);

    useUnsavedChanges({
        shouldConfirmLeave: !!rolesToUpdate,
        onSuccess: submitForm,
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
        if (team?.users) setData(team.users);
    }, [team?.users]);

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
                            await deleteTeamMember(`users/${rowUser.id}`);
                            mutate();
                        },
                    }),
            },
        ],
        [deleteTeamMember, mutate, showModal]
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

    const handleUpdate = async (updatedData: User[]) => {
        setData(updatedData);
        const { changedRoles, allRoles } = getDifferences(updatedData, team!);
        const changeCount = getChangeCount(changedRoles);
        setRolesToUpdate(allRoles);

        hideBar();

        if (changedRoles.length > 0) {
            showBar("TeamMembers", {
                component: TeamMembersActionBar,
                cancelText: "Discard",
                confirmText: "Save",
                changeCount,
                onSuccess: () => {
                    setShouldSubmit(true);
                },
                onCancel: () => {
                    setData(team?.users);
                    hideBar();
                    setRolesToUpdate(null);
                },
            });
        }
    };

    return isTeamListLoading ? (
        <Loading />
    ) : (
        <Table<User> columns={columns} onUpdate={handleUpdate} data={data} />
    );
};

export default TeamMembers;
