"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { useSWRConfig } from "swr";
import { User } from "@/interfaces/User";
import Loading from "@/components/Loading";
import Paper from "@/components/Paper";
import Table from "@/components/Table";
import ChangesActionBar from "@/modules/ChangesActionBar";
import useActionBar from "@/hooks/useActionBar";
import useAuth from "@/hooks/useAuth";
import useDelete from "@/hooks/useDelete";
import useModal from "@/hooks/useModal";
import usePatch from "@/hooks/usePatch";
import { useUnsavedChanges } from "@/hooks/useUnsavedChanges";
import apis from "@/config/apis";
import { getColumns } from "@/config/tables/teamMemberManagement";
import { DeleteForeverIcon } from "@/consts/icons";
import {
    RolesPayload,
    getChangeCount,
    getDifferences,
} from "@/utils/userRoles";

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
    const t = useTranslations(
        "pages.account.team.teamManagement.components.TeamMembers"
    );
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
        `${apis.teamsV1Url}/${teamId}`
    );

    const { showBar, hideBar } = useActionBar();

    const submitForm = useCallback(async () => {
        if (!rolesToUpdate) return;
        const updatingOwnPermissions = !!rolesToUpdate.find(
            role => role.userId === user?.id
        );

        await updateTeamRoles("roles", rolesToUpdate);

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

    const isLastUser = teamMembers.length === 1;
    const deleteLastUserMessage = t("deleteLastMember");
    const deleteYourselfMessage = t("deleteYourself");

    const actions = useMemo(
        () => [
            {
                icon: DeleteForeverIcon,
                checkConditions: (rowUser: User) => {
                    let overrides = {};
                    if (isLastUser) {
                        overrides = {
                            disabled: true,
                            title: deleteLastUserMessage,
                        };
                    }
                    if (rowUser.id === user?.id) {
                        overrides = {
                            disabled: true,
                            title: deleteYourselfMessage,
                        };
                    }
                    return overrides;
                },
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
        [deleteTeamMember, showModal, teamMembers]
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
        return getColumns({
            permissions,
            actions,
            translations: {
                lastRoleAdminMessage: t("lastRoleAdminMessage"),
                lastRoleMessage: t("lastRoleMessage"),
                noPermission: t("noPermission"),
                nameHeader: t("columns.name"),
                actionsHeader: t("columns.actions"),
                teamHeader: t("columns.team"),
                darHeader: t("columns.dar"),
                metaDataHeader: t("columns.metadata"),
            },
        });
    }, [actions, permissions, t]);

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
                pinHeader
            />
        </Paper>
    );
};

export default TeamMembers;
