import { useMemo, useState } from "react";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { PaginationType } from "@/interfaces/Pagination";
import { Team } from "@/interfaces/Team";
import Box from "@/components/Box";
import Loading from "@/components/Loading";
import Pagination from "@/components/Pagination";
import Table from "@/components/Table";
import DeleteTeamDialog from "@/modules/DeleteTeamDialog";
import useDialog from "@/hooks/useDialog";
import useGet from "@/hooks/useGet";
import apis from "@/config/apis";
import { getColumns } from "@/config/tables/teamManagement";
import { Routes } from "@/consts/routes";

const TeamsList = ({
    permissions,
}: {
    permissions: { [key: string]: boolean };
}) => {
    const router = useRouter();
    const { showDialog } = useDialog();

    const t = useTranslations(
        "pages.account.profile.teams.components.TeamsList"
    );

    const [currentPage, setCurrentPage] = useState(1);
    const { data, isLoading, mutate } = useGet<PaginationType<Team>>(
        `${apis.teamsV1Url}?page=${currentPage}`,
        {
            keepPreviousData: true,
            withPagination: true,
        }
    );

    const columns = useMemo(() => {
        return getColumns({
            translations: {
                lastUpdated: t("lastUpdated"),
                dataProvider: t("dataProvider"),
                teamAdmins: t("teamAdmins"),
                questionBank: t("questionBank"),
                action: t("action"),
            },
            permissions,
            handleDelete: (teamId, teamName) =>
                showDialog(DeleteTeamDialog, {
                    teamId,
                    teamName,
                    callback: () => mutate(undefined, true),
                }),
            handleEdit: teamId =>
                router.push(`${Routes.ACCOUNT_TEAMS}/${teamId}`),
        });
    }, [permissions, t]);

    if (isLoading) return <Loading />;

    const { lastPage, list } = data || {};

    const handleUpdate = () => console.log("update");

    return (
        <>
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
        </>
    );
};

export default TeamsList;
