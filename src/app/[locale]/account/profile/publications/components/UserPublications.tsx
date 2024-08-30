"use client";

import { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { useTranslations } from "next-intl";
import { useSearchParams } from "next/navigation";
import { PaginationType } from "@/interfaces/Pagination";
import { Publication } from "@/interfaces/Publication";
import Box from "@/components/Box";
import Button from "@/components/Button";
import Paper from "@/components/Paper";
import Tabs from "@/components/Tabs";
import Typography from "@/components/Typography";
import AddPublicationDialog from "@/modules/AddPublicationDialog";
import useDebounce from "@/hooks/useDebounce";
import useDelete from "@/hooks/useDelete";
import useDialog from "@/hooks/useDialog";
import useGet from "@/hooks/useGet";
import useModal from "@/hooks/useModal";
import usePatch from "@/hooks/usePatch";
import apis from "@/config/apis";
import {
    publicationSearchDefaultValues,
    sortByOptions,
} from "@/config/forms/publicationAccountSearch";
import { colors } from "@/config/theme";
import { DataStatus } from "@/consts/application";
import { AddIcon, ArchiveIcon, EditIcon, UnarchiveIcon } from "@/consts/icons";
import { RouteName } from "@/consts/routeName";
import { capitalise } from "@/utils/general";
import PublicationTab from "./PublicationTab";

interface CountStatus {
    ACTIVE?: number;
    DRAFT?: number;
    ARCHIVED?: number;
}

interface UserPublicationProps {
    permissions: { [key: string]: boolean };
    userId: string;
    teamId?: string;
}

const TRANSLATION_PATH = "pages.account.profile.publications.list";

const UserPublications = ({
    permissions,
    userId,
    teamId,
}: UserPublicationProps) => {
    const t = useTranslations(TRANSLATION_PATH);
    const { showDialog } = useDialog();
    const { showModal } = useModal();
    const searchParams = useSearchParams();

    const tab = searchParams?.get("tab");

    const [initialSort] = sortByOptions.filter(
        o => o.value === publicationSearchDefaultValues.sortField
    );

    const [queryParams, setQueryParams] = useState({
        owner_id: userId,
        withTrashed: "true",
        status: "ACTIVE",
        page: "1",
        sort: `${publicationSearchDefaultValues.sortField}:${initialSort.initialDirection}`,
        paper_title: "",
    });

    const { control, watch, setValue } = useForm({
        defaultValues: {
            ...publicationSearchDefaultValues,
            sortDirection: initialSort.initialDirection,
        },
    });
    const watchAll = watch();

    useEffect(() => {
        const [option] = sortByOptions.filter(
            o => o.value === watchAll.sortField
        );
        setQueryParams(previous => ({
            ...previous,
            sort: `${watchAll.sortField}:${option.initialDirection}`,
        }));
        setValue("sortDirection", option.initialDirection);
    }, [watchAll.sortField, setValue]);

    useEffect(() => {
        setQueryParams(previous => ({
            ...previous,
            sort: `${previous.sort.split(":")[0]}:${watchAll.sortDirection}`,
        }));
    }, [watchAll.sortDirection]);

    const filterTitleDebounced = useDebounce(watchAll.searchTitle, 500);

    useEffect(() => {
        setQueryParams(previous => ({
            ...previous,
            paper_title: filterTitleDebounced,
            page: "1",
        }));
    }, [filterTitleDebounced]);

    useEffect(() => {
        setQueryParams(previous => ({
            ...previous,
            status: searchParams?.get("tab") || "ACTIVE",
        }));
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [searchParams?.get("tab")]);

    const {
        data,
        isLoading,
        mutate: mutatePublications,
    } = useGet<PaginationType<Publication>>(
        `${apis.publicationsV1Url}?${new URLSearchParams(queryParams)}`,
        {
            keepPreviousData: true,
            withPagination: true,
        }
    );

    const unArchivePublication = usePatch<Partial<Publication>>(
        apis.publicationsV1Url,
        {
            itemName: "Publication",
        }
    );
    const archivePublication = useDelete(apis.publicationsV1Url, {
        localeKey: "archivePublication",
        itemName: "Publication",
    });

    const showAddNewButton = useMemo(
        () => permissions["papers.create"],
        [permissions]
    );

    const showArchiveButton =
        tab !== DataStatus.ARCHIVED && permissions["papers.delete"];
    const showUnarchiveButton =
        tab === DataStatus.ARCHIVED && permissions["papers.update"];

    const { data: counts, mutate: mutateCount } = useGet<CountStatus>(
        `${apis.publicationsV1Url}/count/status?owner_id=${userId}`
    );
    const {
        ACTIVE: countActive,
        DRAFT: countDraft,
        ARCHIVED: countArchived,
    } = counts ?? {};

    const actions = [
        ...(permissions["papers.update"]
            ? [
                  {
                      href: teamId
                          ? `/${RouteName.ACCOUNT}/${RouteName.TEAM}/${teamId}/${RouteName.PUBLICATIONS}`
                          : `/${RouteName.ACCOUNT}/${RouteName.PROFILE}/${RouteName.PUBLICATIONS}`,
                      icon: EditIcon,
                      label: t("actions.edit.label"),
                  },
              ]
            : []),
        ...(showUnarchiveButton
            ? [
                  {
                      action: (id: number) => {
                          showModal({
                              tertiaryButton: {
                                  onAction: async () => {
                                      await unArchivePublication(id, {
                                          status: DataStatus.ACTIVE,
                                      });
                                      mutatePublications();
                                      mutateCount();
                                  },
                                  buttonText: t("actions.unarchive.buttonText"),
                              },
                              onSuccess: async () => {
                                  await unArchivePublication(id, {
                                      status: DataStatus.DRAFT,
                                  });
                                  mutatePublications();
                                  mutateCount();
                              },
                              confirmText: t("actions.unarchive.confirmText"),
                              title: t("actions.unarchive.title"),
                              content: t("actions.unarchive.content"),
                          });
                      },
                      icon: UnarchiveIcon,
                      label: t("actions.unarchive.label"),
                  },
              ]
            : []),
        ...(showArchiveButton
            ? [
                  {
                      action: async (id: number) => {
                          await archivePublication(id);
                          mutatePublications();
                          mutateCount();
                      },
                      icon: ArchiveIcon,
                      label: t("actions.archive.label"),
                  },
              ]
            : []),
    ];
    const tabsList = [
        {
            label: capitalise(DataStatus.ACTIVE),
            value: DataStatus.ACTIVE,
            dsCount: countActive ?? 0,
        },
        {
            label: capitalise(DataStatus.DRAFT),
            value: DataStatus.DRAFT,
            dsCount: countDraft ?? 0,
        },
        {
            label: capitalise(DataStatus.ARCHIVED),
            value: DataStatus.ARCHIVED,
            dsCount: countArchived ?? 0,
        },
    ].map(tabItem => ({
        label: `${tabItem.label} (${tabItem.dsCount})`,
        value: tabItem.value,
        content: (
            <PublicationTab
                {...data}
                control={control}
                setValue={setValue}
                key={tabItem.value}
                label={tabItem.label}
                list={data?.list}
                currentPage={parseInt(queryParams.page, 10)}
                setCurrentPage={page =>
                    setQueryParams({
                        ...queryParams,
                        page: page.toString(),
                    })
                }
                isLoading={isLoading}
                actions={actions}
            />
        ),
    }));

    const handleAdd = () => {
        showDialog(AddPublicationDialog, { userId });
    };

    return (
        <>
            <Paper>
                <Box
                    sx={{
                        bgcolor: "white",
                        p: 2,
                        display: "flex",
                        alignItems: "center",
                    }}>
                    <Box sx={{ flexGrow: 1, p: 0 }}>
                        <Typography variant="h2">{t("title")}</Typography>
                        <Typography>{t("text")}</Typography>
                    </Box>

                    {showAddNewButton && (
                        <Button onClick={handleAdd} startIcon={<AddIcon />}>
                            {t("create")}
                        </Button>
                    )}
                </Box>
            </Paper>

            <Tabs
                centered
                tabs={tabsList}
                tabBoxSx={{ padding: 0, background: colors.white }}
                rootBoxSx={{ padding: 0 }}
            />
        </>
    );
};

export default UserPublications;
