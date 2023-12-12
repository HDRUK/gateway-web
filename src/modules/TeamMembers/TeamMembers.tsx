"use client";

import { useCallback, useEffect, useMemo, useState } from "react";

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

import useDelete from "@/hooks/useDelete";
import useModal from "@/hooks/useModal";
import { useSWRConfig } from "swr";
import { useUnsavedChanges } from "@/hooks/useUnsavedChanges";
import usePatch from "@/hooks/usePatch";
import ChangesActionBar from "@/modules/ChangesActionBar";
import Paper from "@/components/Paper";
import { DeleteForeverIcon } from "@/consts/icons";
import Loading from "@/components/Loading";
import { useRouter } from "next/navigation";

interface TeamMembersProps {
    teamMembers: User[];
    teamId: number;
    permissions: { [key: string]: boolean };
}

const TeamMembers = ({
    teamMembers,
    permissions,
    teamId,
}: TeamMembersProps) => {
    const { user } = useAuth();
    const router = useRouter();
    const { showModal } = useModal();
    const { mutate: mututeUser } = useSWRConfig();

    const [rolesToUpdate, setRolesToUpdate] = useState<RolesPayload[] | null>(
        null
    );
    const [tableRows, setTableRows] = useState<User[]>([]);
    const [shouldSubmit, setShouldSubmit] = useState<boolean>(false);

    const updateTeamRoles = usePatch<RolesPayload[]>(
        `${apis.teamsV1Url}/${teamId}/roles`
    );

    const { showBar, hideBar } = useActionBar();

    const submitForm = useCallback(async () => {
        if (!rolesToUpdate) return;
        const updatingOwnPermissions = !!rolesToUpdate.find(
            role => role.userId === user?.id
        );

        await updateTeamRoles(null, rolesToUpdate);

        router.refresh();
        setRolesToUpdate(null);
        hideBar();

        if (updatingOwnPermissions) {
            mututeUser(apis.authInternalUrl);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [rolesToUpdate, updateTeamRoles, user?.id]);

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
                            router.refresh();
                        },
                    }),
            },
        ],
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [deleteTeamMember, showModal]
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

    if (tableRows.length === 0)
        return (
            <Paper>
                <Loading />
            </Paper>
        );

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
