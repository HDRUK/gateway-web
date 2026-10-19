"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@hdruk/ui";
import { tokens } from "@hdruk/ui/theme";
import { useTranslations } from "next-intl";
import { useSearchParams } from "next/navigation";
import { PaginationType } from "@/interfaces/Pagination";
import { Publication } from "@/interfaces/Publication";
import Box from "@/components/Box";
import Paper from "@/components/Paper";
import Tabs from "@/components/Tabs";
import Typography from "@/components/Typography";
import AddPublicationDialog from "@/modules/AddPublicationDialog";
import useActivationCheck from "@/hooks/useActivationCheck";
import useDebounce from "@/hooks/useDebounce";
import useDialog from "@/hooks/useDialog";
import useGet from "@/hooks/useGet";
import usePatch from "@/hooks/usePatch";
import notificationService from "@/services/notification";
import apis from "@/config/apis";
import { publicationValidationSchema } from "@/config/forms/publication";
import {
    publicationSearchDefaultValues,
    sortByOptions,
} from "@/config/forms/publicationAccountSearch";
import { DataStatus } from "@/consts/application";
import { AddIcon, EditIcon } from "@/consts/icons";
import { RouteName } from "@/consts/routeName";
import {
    getPublicationActivationValues,
    loadEntityActivation,
} from "@/utils/activation";
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
    const checkActivation = useActivationCheck();
    const { showDialog } = useDialog();
    const searchParams = useSearchParams();

    const [initialSort] = sortByOptions.filter(
        o => o.value === publicationSearchDefaultValues.sortField
    );

    const [queryParams, setQueryParams] = useState(() => ({
        status: DataStatus.ACTIVE.toLowerCase(),
        page: "1",
        sort: `${publicationSearchDefaultValues.sortField}:${initialSort.initialDirection}`,
        paper_title: "",
    }));

    const { status, ...filteredQueryParams } = queryParams;

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

    const basePublicationsUrl = teamId
        ? `${apis.teamsV2Url}/${teamId}/publications`
        : `${apis.usersV2Url}/${userId}/publications`;

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
            status: (
                searchParams?.get("tab") || DataStatus.ACTIVE
            ).toLowerCase(),
        }));
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [searchParams?.get("tab")]);

    const {
        data,
        isLoading,
        mutate: mutatePublications,
    } = useGet<PaginationType<Publication>>(
        `${basePublicationsUrl}/status/${status}?${new URLSearchParams(
            filteredQueryParams
        )}`,
        {
            keepPreviousData: true,
            withPagination: true,
        }
    );

    const patchPublication = usePatch(basePublicationsUrl, {
        itemName: "Publication",
        successNotificationsOn: false,
    });

    const handleStatusChange = async (id: number, status: DataStatus) => {
        if (
            status === DataStatus.ACTIVE &&
            !(await checkActivation({
                load: loadEntityActivation(
                    `${basePublicationsUrl}/${id}`,
                    publicationValidationSchema,
                    getPublicationActivationValues
                ),
            }))
        ) {
            return;
        }

        const result = await patchPublication(id, { status });
        mutatePublications();
        mutateCount();

        if (result !== null) {
            notificationService.apiSuccess(t(`actions.statusChange.${status}`));
        }
    };

    const { data: counts, mutate: mutateCount } = useGet<CountStatus>(
        `${basePublicationsUrl}/count/status`
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
                onStatusChange={
                    permissions["papers.update"] || permissions["papers.delete"]
                        ? handleStatusChange
                        : undefined
                }
                disabledStatusOptions={[
                    ...(permissions["papers.update"]
                        ? []
                        : [DataStatus.ACTIVE, DataStatus.DRAFT]),
                    ...(permissions["papers.delete"]
                        ? []
                        : [DataStatus.ARCHIVED]),
                ]}
            />
        ),
    }));

    const handleAdd = () => {
        showDialog(AddPublicationDialog, { userId, teamId });
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

                    <Button onClick={handleAdd} startIcon={<AddIcon />}>
                        {t("create")}
                    </Button>
                </Box>
            </Paper>

            <Tabs
                centered
                tabs={tabsList}
                tabBoxSx={{ padding: 0, background: tokens.background.white }}
                rootBoxSx={{ padding: 0 }}
            />
        </>
    );
};

export default UserPublications;
