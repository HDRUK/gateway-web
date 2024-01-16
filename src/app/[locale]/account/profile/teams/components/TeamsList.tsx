import { useMemo, useState } from "react";
import { Team } from "@/interfaces/Team";
import Loading from "@/components/Loading";
import Paper from "@/components/Paper";
import Table from "@/components/Table";
import useGet from "@/hooks/useGet";
import useGetTeam from "@/hooks/useGetTeam";
import apis from "@/config/apis";
import { getColumns } from "@/config/tables/teamManagement";

const TeamsList = ({
    permissions,
}: {
    permissions: { [key: string]: boolean };
}) => {
    const [tableRows, setTableRows] = useState<Team[]>([]);
    const { data: teams } = useGet(apis.teamsV1Url);

    const actions = useMemo(
        () => [
            // {
            //     icon: <DeleteForeverIcon color="primary" />,
            //     onClick: (rowUser: User) =>
            //         showModal({
            //             confirmText: "Remove",
            //             title: "Delete a user",
            //             content: `Are you sure you want to remove ${rowUser.firstname}  ${rowUser.lastname}?`,
            //             onSuccess: async () => {
            //                 deleteTeamMember(`users/${rowUser.id}`);
            //                 router.refresh();
            //             },
            //         }),
            // },
        ],
        // eslint-disable-next-line react-hooks/exhaustive-deps
        []
    );

    const columns = useMemo(() => {
        return getColumns(permissions, actions);
    }, [actions, permissions]);

    if (tableRows.length === 0)
        return (
            <Paper>
                <Loading />
            </Paper>
        );

    const handleUpdate = () => {};
    return (
        <Paper>
            <Table<Team>
                columns={columns}
                onUpdate={handleUpdate}
                rows={tableRows}
            />
        </Paper>
    );
};

export default TeamsList;
