import { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { PaginationType } from "@/interfaces/Pagination";
import { Team } from "@/interfaces/Team";
import Box from "@/components/Box";
import InputWrapper from "@/components/InputWrapper";
import Pagination from "@/components/Pagination";
import Table from "@/components/Table";
import DeleteTeamDialog from "@/modules/DeleteTeamDialog";
import useDebounce from "@/hooks/useDebounce";
import useDialog from "@/hooks/useDialog";
import useGet from "@/hooks/useGet";
import apis from "@/config/apis";
import {
    teamSearchDefaultValues,
    teamSearchFilter,
} from "@/config/forms/teamSearch";
import { getColumns } from "@/config/tables/teamManagement";
import { Routes } from "@/consts/routes";

const TRANSLATION_PATH_TEAMS =
    "pages.account.profile.teams.components.TeamsList";
const TRANSLATION_PATH_COMMON = "common";

const TeamsList = ({
    permissions,
}: {
    permissions: { [key: string]: boolean };
}) => {
    const router = useRouter();
    const { showDialog } = useDialog();
    const t = useTranslations();

    const [questionBankStatus, setQuestionBankStatus] = useState<
        "true" | "false"
    >();

    const [sort, setSort] = useState({ key: "created_at", direction: "desc" });
    const [currentPage, setCurrentPage] = useState(1);

    const { control, watch, setValue } = useForm({
        defaultValues: teamSearchDefaultValues,
    });

    const watchAll = watch();
    const searchDebounced = useDebounce(watchAll.search, 500);

    useEffect(() => {
        setCurrentPage(1);
    }, [searchDebounced]);

    const queryParams = new URLSearchParams();

    queryParams.append("sort", `${sort.key}:${sort.direction}`);
    queryParams.append("page", currentPage.toString());

    if (questionBankStatus) {
        queryParams.append("is_question_bank", questionBankStatus);
    }

    if (searchDebounced) {
        queryParams.append("name", searchDebounced);
    }

    queryParams.sort();
    const qs = queryParams.toString();

    const { data, isLoading, mutate } = useGet<PaginationType<Team>>(
        `${apis.teamsV1Url}?${qs}`,
        {
            keepPreviousData: true,
            withPagination: true,
        }
    );

    const columns = useMemo(() => {
        return getColumns({
            setSort,
            sort,
            translations: {
                lastUpdated: t(`${TRANSLATION_PATH_TEAMS}.lastUpdated`),
                dataProvider: t(`${TRANSLATION_PATH_TEAMS}.dataProvider`),
                teamAdmins: t(`${TRANSLATION_PATH_TEAMS}.teamAdmins`),
                questionBank: t(`${TRANSLATION_PATH_COMMON}.questionBank`),
                disabled: t(`${TRANSLATION_PATH_COMMON}.disabled`),
                enabled: t(`${TRANSLATION_PATH_COMMON}.enabled`),
                all: t(`${TRANSLATION_PATH_COMMON}.all`),
                action: t(`${TRANSLATION_PATH_TEAMS}.action`),
            },
            setQuestionBankStatus,
            questionBankStatus,
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
    }, [mutate, permissions, questionBankStatus, router, showDialog, sort, t]);

    const { lastPage, list } = data || {};

    const handleUpdate = () => console.log("update");

    return (
        <>
            <Box sx={{ p: 0, mb: 2, maxWidth: 400 }}>
                <InputWrapper
                    setValue={setValue}
                    control={control}
                    {...teamSearchFilter}
                />
            </Box>
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
