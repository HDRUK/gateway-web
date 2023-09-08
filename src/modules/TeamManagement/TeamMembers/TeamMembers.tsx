import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/router";
import useAuth from "@/hooks/useAuth";
import useActionBar from "@/hooks/useActionBar";
import Loading from "@/components/Loading";
import apis from "@/config/apis";
import useGet from "@/hooks/useGet";
import Table from "@/components/Table";
import { getColumns } from "@/config/tables/teamManagement";
import { getChangeCount, getDifferences } from "@/utils/userRoles";
import { User } from "@/interfaces/User";
import { Team } from "@/interfaces/Team";
import pLimit from "p-limit";
import notificationService from "@/services/notification";
import { putRequest } from "@/services/api/put";
import { useLeavePageConfirm } from "@/hooks/useLeavePageConfirm";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import useDelete from "@/hooks/useDelete";
import useModal from "@/hooks/useModal";
import TeamMembersActionBar from "./TeamMembers.actionBar";

const limit = pLimit(1);

const TeamMembers = () => {
    const { showModal } = useModal();

    const [inProgress, setInProgress] = useState(false);
    const [data, setData] = useState([]);

    useLeavePageConfirm(inProgress, "Do you want to save your changes?");

    const { user } = useAuth();

    const router = useRouter();
    const { teamId } = router.query;

    const {
        data: team,
        isLoading: isTeamListLoading,
        mutate,
    } = useGet<Team>(`${apis.teamsV1Url}/${teamId}`);

    const deleteTeamMember = useDelete(`${apis.teamsV1Url}/${teamId}`, {
        itemName: `Team member`,
    });

    useEffect(() => {
        if (!team?.users) return;
        setData(team.users);
    }, [team?.users]);

    const { showBar, hideBar } = useActionBar();

    const actions = [
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
    ];

    const columns = useMemo(() => {
        const currentTeamUser = team?.users?.find(
            teamUser => teamUser.id === user?.id
        );
        const currentUserRoles =
            currentTeamUser?.roles
                .filter(roles => roles.enabled)
                .map(roles => roles.name) || [];
        return getColumns(currentUserRoles, actions);
    }, [team?.users, user]);

    const submitForm = async allRoles => {
        const promises = allRoles.map(async payload => {
            await limit(() =>
                putRequest(
                    `${apis.teamsV1Url}/${teamId}/users/${payload.userId}`,
                    { roles: payload.roles },
                    {
                        notificationOptions: {
                            errorNotificationsOn: false,
                            successNotificationsOn: false,
                        },
                    }
                )
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
        setInProgress(false);
        hideBar();
    };

    const handleUpdate = async (updatedData: User[]) => {
        setData(updatedData);
        const { changedRoles, allRoles } = getDifferences(updatedData, team!);
        const changeCount = getChangeCount(changedRoles);
        setInProgress(changeCount > 0);

        hideBar();

        if (changedRoles.length > 0) {
            showBar("TeamMembers", {
                component: TeamMembersActionBar,
                cancelText: "Discard",
                confirmText: "Save",
                changeCount,
                onSuccess: () => submitForm(allRoles),
                onCancel: () => {
                    setData(team?.users);
                    hideBar();
                    setInProgress(false);
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
