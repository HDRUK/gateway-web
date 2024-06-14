"use client";

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
import { SavedSearchWithPivot } from "@/interfaces/Search";
import Loading from "@/components/Loading";
import Paper from "@/components/Paper";
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
import DataList from "./components/DataList";
import DataListItem from "./components/DataListItem";
import DeleteAction from "./components/DeleteAction";

const TRANSLATION_PATH = "pages.saved_searches";

const SavedSearches = () => {
    const { isLoading } = useAuth();
    const t = useTranslations(TRANSLATION_PATH);

    const { showModal, hideModal } = useModal();

    const {
        isLoading: isSavedSearchesLoading,
        data: savedSearchesData,
        mutate: saveSearchesMutate,
    } = useGet<SavedSearchWithPivot[]>(apis.saveSearchesV1Url);

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
                </Box>
                <List>
                    {savedSearchesData?.map((data, i: number) => {
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
                                        <DeleteAction
                                            onDelete={() =>
                                                handleDeleteSavedSearch(data)
                                            }
                                        />
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
                                                        sx={{ flexGrow: 1 }}>
                                                        <DataListItem
                                                            primary={t(
                                                                "labels.entityType"
                                                            )}
                                                            secondary={toTitleCase(
                                                                search_endpoint
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
                                                    <Typography variant="caption">
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
                                {i < savedSearchesData.length - 1 && (
                                    <Divider />
                                )}
                            </>
                        );
                    })}
                </List>
            </Box>
        </Paper>
    );
};

export default SavedSearches;
