import { useMemo } from "react";
import { Team } from "@/interfaces/Team";
import Loading from "@/components/Loading";
import Paper from "@/components/Paper";
import Table from "@/components/Table";
import useGet from "@/hooks/useGet";
import apis from "@/config/apis";
import { getColumns } from "@/config/tables/teamManagement";

const TeamsList = ({
    permissions,
}: {
    permissions: { [key: string]: boolean };
}) => {
    const { data: teams, isLoading } = useGet<Team[]>(apis.teamsV1Url);

    const columns = useMemo(() => {
        return getColumns(permissions, {
            handleDelete: id => console.log(`delete: ${id}`),
            handleEdit: id => console.log(`edit: ${id}`),
        });
    }, [permissions]);

    if (isLoading)
        return (
            <Paper>
                <Loading />
            </Paper>
        );

    const handleUpdate = () => console.log("update");

    return (
        <Paper>
            <Table<Team>
                columns={columns}
                onUpdate={handleUpdate}
                rows={teams || []}
            />
        </Paper>
    );
};

export default TeamsList;
