"use client";

import { useState } from "react";
import {
    Box,
    Divider,
    List,
    ListItem,
    ListItemButton,
    ListItemText,
    Typography,
} from "@mui/material";
import dayjs from "dayjs";
import { flatten } from "lodash";
import { useTranslations } from "next-intl";
import useSWRMutation from "swr/mutation";
import { PaginationType } from "@/interfaces/Pagination";
import { SavedSearchWithPivot } from "@/interfaces/Search";
import { DataList, DataListItem } from "@/components/DataList";
import ListItemActions from "@/components/ListItemActions";
import Loading from "@/components/Loading";
import Pagination from "@/components/Pagination";
import Paper from "@/components/Paper";
import ShowingXofX from "@/components/ShowingXofX";
import useAuth from "@/hooks/useAuth";
import useGet from "@/hooks/useGet";
import useModal from "@/hooks/useModal";
import deleteRequest from "@/services/api/delete";
import apis from "@/config/apis";
import { SHORT_DATE_FORMAT } from "@/consts/date";
import {
    getFiltersFromSaveSearch,
    getUrlFromSearchParams,
} from "@/utils/search";
import { toTitleCase } from "@/utils/string";
import DeleteAction from "./components/DeleteAction";

const TRANSLATION_PATH = "pages.saved_searches";
const TRANSLATION_PATH_SEARCH = "pages.search";

const SavedSearches = () => {
    const { isLoading } = useAuth();
    const t = useTranslations(TRANSLATION_PATH);
    const tSearch = useTranslations(TRANSLATION_PATH_SEARCH);

    const { showModal, hideModal } = useModal();

    const [currentPage, setCurrentPage] = useState(1);

    const {
        isLoading: isSavedSearchesLoading,
        data: savedSearchesData,
        mutate: saveSearchesMutate,
    } = useGet<PaginationType<SavedSearchWithPivot>>(
        `${apis.saveSearchesV1Url}?page=${currentPage}`,
        {
            keepPreviousData: true,
            withPagination: true,
        }
    );

    const { lastPage, list } = savedSearchesData || {};

    const { trigger: deleteSavedSearchesTrigger } = useSWRMutation(
        apis.saveSearchesV1Url,
        async (url, { arg }: { arg: number }) =>
            deleteRequest(`${url}/${arg}`, {
                notificationOptions: {
                    successNotificationsOn: true,
                    t,
                },
            })
    );

    const handleDeleteSavedSearch = async ({
        id,
        name,
    }: SavedSearchWithPivot) => {
        showModal({
            title: t(`deleteModal.title`, { name }),
            confirmText: t(`deleteModal.confirmButton`),
            cancelText: t(`deleteModal.cancelButton`),
            onSuccess: async () => {
                await deleteSavedSearchesTrigger(id);

                saveSearchesMutate();

                hideModal();
            },
            onCancel: () => {
                hideModal();
            },
        });
    };

    if (isLoading || isSavedSearchesLoading) return <Loading />;

    return (
        <Paper>
            <Box>
                <Box sx={{ px: 2, pt: 2 }}>
                    <Typography variant="h2">{t("title")}</Typography>
                    <Typography sx={{ marginBottom: 4 }}>
                        {t("text")}
                    </Typography>
                    {!list?.length && (
                        <Box sx={{ pb: 2 }}>{t("noResults")}</Box>
                    )}
                    {savedSearchesData?.total && (
                        <ShowingXofX
                            to={savedSearchesData?.to}
                            from={savedSearchesData?.from}
                            total={savedSearchesData?.total}
                        />
                    )}
                </Box>

                <List>
                    {list?.map((data, i: number) => {
                        const {
                            search_endpoint,
                            sort_order,
                            search_term,
                            filters,
                            name,
                            updated_at,
                        } = data;

                        const formattedFilters =
                            getFiltersFromSaveSearch(filters) || {};

                        const href = getUrlFromSearchParams(
                            search_endpoint,
                            formattedFilters,
                            sort_order
                        );

                        const displayFilterValues = flatten(
                            Object.values(formattedFilters)
                        ).join(", ");

                        return (
                            <>
                                <ListItem
                                    secondaryAction={
                                        <ListItemActions
                                            sx={{ height: "45px" }}>
                                            <DeleteAction
                                                onDelete={() =>
                                                    handleDeleteSavedSearch(
                                                        data
                                                    )
                                                }
                                            />
                                        </ListItemActions>
                                    }
                                    sx={{ p: 0 }}
                                    alignItems="flex-start">
                                    <ListItemButton component="a" href={href}>
                                        <ListItemText
                                            primary={name}
                                            primaryTypographyProps={{
                                                color: "primary",
                                                fontWeight: 600,
                                                fontSize: 16,
                                                mb: 1.5,
                                            }}
                                            secondary={
                                                <Box
                                                    sx={{
                                                        display: "flex",
                                                        alignItems: "flex-end",
                                                        pr: 5,
                                                    }}>
                                                    <DataList
                                                        sx={{
                                                            flexGrow: 1,
                                                        }}>
                                                        <DataListItem
                                                            primary={t(
                                                                "labels.entityType"
                                                            )}
                                                            secondary={toTitleCase(
                                                                tSearch(
                                                                    search_endpoint
                                                                )
                                                            )}
                                                        />
                                                        <DataListItem
                                                            primary={t(
                                                                "labels.terms"
                                                            )}
                                                            secondary={
                                                                search_term ||
                                                                t("noData")
                                                            }
                                                        />
                                                        <DataListItem
                                                            primary={t(
                                                                "labels.filters"
                                                            )}
                                                            secondary={
                                                                <Typography color="secondary">
                                                                    {displayFilterValues.length
                                                                        ? displayFilterValues
                                                                        : t(
                                                                              "noData"
                                                                          )}
                                                                </Typography>
                                                            }
                                                        />
                                                    </DataList>
                                                    <Typography>
                                                        {t("dateSaved", {
                                                            date: dayjs(
                                                                updated_at
                                                            ).format(
                                                                SHORT_DATE_FORMAT
                                                            ),
                                                        })}
                                                    </Typography>
                                                </Box>
                                            }
                                        />
                                    </ListItemButton>
                                </ListItem>
                                {i < list.length - 1 && <Divider />}
                            </>
                        );
                    })}
                </List>
            </Box>

            <Pagination
                isLoading={isLoading}
                page={currentPage}
                count={lastPage}
                onChange={(e: React.ChangeEvent<unknown>, page: number) =>
                    setCurrentPage(page)
                }
                sx={{ mt: 2, mb: 2 }}
            />
        </Paper>
    );
};

export default SavedSearches;
