"use client";

import { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@hdruk/ui";
import { tokens } from "@hdruk/ui/theme";
import { useTranslations } from "next-intl";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { DataUse } from "@/interfaces/DataUse";
import { PaginationType } from "@/interfaces/Pagination";
import Box from "@/components/Box";
import Paper from "@/components/Paper";
import Tabs from "@/components/Tabs";
import Typography from "@/components/Typography";
import useActivationCheck from "@/hooks/useActivationCheck";
import useDebounce from "@/hooks/useDebounce";
import useGet from "@/hooks/useGet";
import usePatch from "@/hooks/usePatch";
import notificationService from "@/services/notification";
import apis from "@/config/apis";
import { dataUseValidationSchema } from "@/config/forms/dataUse";
import {
    dataUseSearchDefaultValues,
    sortByOptions,
} from "@/config/forms/dataUseAccountSearch";
import { DataStatus } from "@/consts/application";
import { AddIcon, EditIcon } from "@/consts/icons";
import { RouteName } from "@/consts/routeName";
import {
    ACCOUNT,
    DATA_USES,
    PAGES,
    TEAM,
    COMPONENTS,
    TITLE,
    TEXT,
} from "@/consts/translation";
import { loadEntityActivation } from "@/utils/activation";
import { capitalise } from "@/utils/general";
import DataUseTab from "../DataUseTab";

interface CountStatus {
    ACTIVE?: number;
    DRAFT?: number;
    ARCHIVED?: number;
}

interface TeamDataUsesProps {
    permissions: { [key: string]: boolean };
    teamId: string;
}

const TRANSLATION_PATH = `${PAGES}.${ACCOUNT}.${TEAM}.${DATA_USES}.${COMPONENTS}.TeamDataUses`;

const TeamDataUses = ({ permissions, teamId }: TeamDataUsesProps) => {
    const t = useTranslations(TRANSLATION_PATH);
    const checkActivation = useActivationCheck();
    const router = useRouter();
    const searchParams = useSearchParams();
    const params = useParams<{ teamId: string }>();

    const [initialSort] = sortByOptions.filter(
        o => o.value === dataUseSearchDefaultValues.sortField
    );

    const [queryParams, setQueryParams] = useState({
        status: DataStatus.ACTIVE.toLowerCase(),
        page: "1",
        sort: `${dataUseSearchDefaultValues.sortField}:${initialSort.initialDirection}`,
        project_title: "",
    });

    const { status, ...filteredQueryParams } = queryParams;

    const { control, watch, setValue } = useForm({
        defaultValues: {
            ...dataUseSearchDefaultValues,
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
            project_title: filterTitleDebounced,
            page: "1",
        }));
    }, [filterTitleDebounced]);

    useEffect(() => {
        setQueryParams(previous => ({
            ...previous,
            status: (
                searchParams?.get("tab") || DataStatus.ACTIVE
            ).toLowerCase(),
            page: "1",
        }));
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [searchParams?.get("tab")]);

    const baseDurUrl = `${apis.teamsV2Url}/${teamId}/dur`;

    const { data: counts, mutate: mutateCount } = useGet<CountStatus>(
        `${baseDurUrl}/count/status`
    );

    const {
        ACTIVE: countActive,
        DRAFT: countDraft,
        ARCHIVED: countArchived,
    } = counts ?? {};

    const {
        data,
        isLoading,
        mutate: mutateDataUses,
    } = useGet<PaginationType<DataUse>>(
        `${baseDurUrl}/status/${status}/?${new URLSearchParams(
            filteredQueryParams
        )}`,
        {
            keepPreviousData: true,
            withPagination: true,
        }
    );

    const patchDataUse = usePatch<Partial<DataUse>>(baseDurUrl, {
        itemName: "Data Use",
        successNotificationsOn: false,
    });

    useEffect(() => {
        window.scrollTo({ top: 0 });
    }, [queryParams.page]);

    const handleStatusChange = async (id: number, status: DataStatus) => {
        if (
            status === DataStatus.ACTIVE &&
            !(await checkActivation({
                load: loadEntityActivation(
                    `${baseDurUrl}/${id}`,
                    dataUseValidationSchema
                ),
            }))
        ) {
            return;
        }

        const result = await patchDataUse(id, { status });
        mutateDataUses();
        mutateCount();

        if (result !== null) {
            notificationService.apiSuccess(t(`actions.statusChange.${status}`));
        }
    };
    const showAddNewButton = useMemo(
        () => permissions["roles.dar-m.update"],
        [permissions]
    );

    const actions = [
        ...(permissions["dur.update"]
            ? [
                  {
                      href: `/${RouteName.ACCOUNT}/${RouteName.TEAM}/${params?.teamId}/${RouteName.DATA_USES}`,
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
            duCount: countActive ?? 0,
        },
        {
            label: capitalise(DataStatus.DRAFT),
            value: DataStatus.DRAFT,
            duCount: countDraft ?? 0,
        },
        {
            label: capitalise(DataStatus.ARCHIVED),
            value: DataStatus.ARCHIVED,
            duCount: countArchived ?? 0,
        },
    ].map(tabItem => ({
        label: `${tabItem.label} (${tabItem.duCount})`,
        value: tabItem.value,
        content: (
            <DataUseTab
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
                    permissions["dur.update"] || permissions["dur.delete"]
                        ? handleStatusChange
                        : undefined
                }
                disabledStatusOptions={[
                    ...(permissions["dur.update"]
                        ? []
                        : [DataStatus.ACTIVE, DataStatus.DRAFT]),
                    ...(permissions["dur.delete"] ? [] : [DataStatus.ARCHIVED]),
                ]}
            />
        ),
    }));

    const handleAdd = () => {
        const DATAUSE_CREATE_ROUTE = `/${RouteName.ACCOUNT}/${RouteName.TEAM}/${teamId}/${RouteName.DATA_USES}/${RouteName.CREATE}`;
        router.push(DATAUSE_CREATE_ROUTE);
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
                        <Typography variant="h2">{t(TITLE)}</Typography>
                        <Typography>{t(TEXT)}</Typography>
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
                tabBoxSx={{ padding: 0, background: tokens.background.white }}
                rootBoxSx={{ padding: 0 }}
            />
        </>
    );
};

export default TeamDataUses;
