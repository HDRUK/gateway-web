"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Alert } from "@mui/material";
import { useTranslations } from "next-intl";
import { PaginationType } from "@/interfaces/Pagination";
import { User } from "@/interfaces/User";
import Box from "@/components/Box";
import InputWrapper from "@/components/InputWrapper";
import Loading from "@/components/Loading";
import Pagination from "@/components/Pagination";
import Table from "@/components/Table";
import DeleteUserDialog from "@/modules/DeleteUserDialog";
import RemoveFromTeamsDialog from "@/modules/RemoveFromTeamsDialog";
import useAuth from "@/hooks/useAuth";
import useDebounce from "@/hooks/useDebounce";
import useDialog from "@/hooks/useDialog";
import useGet from "@/hooks/useGet";
import apis from "@/config/apis";
import {
    userAdminSearchDefaultValues,
    userAdminSearchFilter,
} from "@/config/forms/userAdminSearch";
import { GlobalDialogContextProps } from "@/providers/DialogProvider";
import { getColumns } from "./UsersTab.utils";

const TRANSLATION_PATH = "pages.account.profile.searchAdmin";

export default function UsersTab() {
    const t = useTranslations(TRANSLATION_PATH);
    const { user: currentUser } = useAuth();
    const { showDialog } = useDialog() as GlobalDialogContextProps;

    const [currentPage, setCurrentPage] = useState(1);
    const [removedUserIds, setRemovedUserIds] = useState<number[]>([]);

    const { control, watch, setValue } = useForm({
        defaultValues: userAdminSearchDefaultValues,
    });
    const searchDebounced = useDebounce(watch("search"), 500);

    useEffect(() => {
        setCurrentPage(1);
    }, [searchDebounced]);

    const queryParams = new URLSearchParams();
    queryParams.append("page", currentPage.toString());
    if (searchDebounced) {
        queryParams.append("search", searchDebounced);
    }

    const { data, isLoading, mutate } = useGet<PaginationType<User>>(
        `${apis.usersV1Url}?${queryParams}`,
        { withPagination: true, keepPreviousData: true }
    );

    const { lastPage, list } = data || {};

    const users = (list || []).filter(
        user => !removedUserIds.includes(user.id)
    );

    const userIds = users.map(user => user.id);
    const ownedEntityCountsUrl = userIds.length
        ? `${apis.adminUsersV1Url}/owned-entity-counts?${userIds
              .map(id => `user_ids[]=${id}`)
              .join("&")}`
        : null;

    const { data: ownedEntityCounts, isLoading: isLoadingOwnedEntityCounts } =
        useGet<Record<number, number>>(ownedEntityCountsUrl);

    const handleDelete = (targetUser: User) => {
        showDialog(DeleteUserDialog, {
            userId: targetUser.id,
            userName: targetUser.name,
            onDeleted: (deletedUserId: number) => {
                setRemovedUserIds(prev => [...prev, deletedUserId]);
            },
        });
    };

    const handleRemoveFromTeams = (targetUser: User) => {
        showDialog(RemoveFromTeamsDialog, {
            userId: targetUser.id,
            userName: targetUser.name,
            teams: (targetUser.teams || []).map(team => ({
                id: team.id,
                name: team.name || `Team #${team.id}`,
            })),
            onRemoved: () => {
                mutate();
            },
        });
    };

    const columns = getColumns({
        onDelete: handleDelete,
        onRemoveFromTeams: handleRemoveFromTeams,
        currentUserId: currentUser?.id,
        ownedEntityCounts,
        isLoadingOwnedEntityCounts,
    });

    return (
        <Box sx={{ p: 0 }}>
            <Alert severity="warning" sx={{ mb: 2 }}>
                {t("usersWarning")}
            </Alert>

            <Box sx={{ p: 0, width: "50%", mb: 2 }}>
                <InputWrapper
                    setValue={setValue}
                    control={control}
                    {...userAdminSearchFilter}
                />
            </Box>

            {isLoading && !data && <Loading />}

            {!!data && (
                <>
                    <Table<User> columns={columns} rows={users} pinHeader />
                    <Pagination
                        isLoading={isLoading}
                        page={currentPage}
                        count={lastPage}
                        onChange={(
                            _e: React.ChangeEvent<unknown>,
                            page: number
                        ) => setCurrentPage(page)}
                    />
                </>
            )}
        </Box>
    );
}
