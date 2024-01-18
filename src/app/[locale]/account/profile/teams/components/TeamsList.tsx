import { useMemo, useState } from "react";
import { PaginationType } from "@/interfaces/Pagination";
import { Team } from "@/interfaces/Team";
import Box from "@/components/Box";
import Loading from "@/components/Loading";
import Pagination from "@/components/Pagination";
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
    const [currentPage, setCurrentPage] = useState(1);
    const { data, isLoading } = useGet<PaginationType<Team>>(
        `${apis.teamsV1Url}?page=${currentPage}`,
        {
            keepPreviousData: true,
            withPagination: true,
        }
    );

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

    const { lastPage, list } = data || {};

    const handleUpdate = () => console.log("update");

    return (
        <Paper>
            <Box sx={{ p: 0, mb: 2 }}>
                <Table<Team>
                    columns={columns}
                    onUpdate={handleUpdate}
                    rows={list || []}
                />
            </Box>
            <Pagination
                isLoading={isLoading}
                page={currentPage}
                count={lastPage}
                onChange={(e: React.ChangeEvent<unknown>, page: number) =>
                    setCurrentPage(page)
                }
            />
        </Paper>
    );
};

export default TeamsList;
