"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { useTranslations } from "next-intl";
import { CohortRequest, CohortRequestStatus } from "@/interfaces/CohortRequest";
import { PaginationType } from "@/interfaces/Pagination";
import Box from "@/components/Box";
import InputWrapper from "@/components/InputWrapper";
import Loading from "@/components/Loading";
import Pagination from "@/components/Pagination";
import Table from "@/components/Table";
import useDebounce from "@/hooks/useDebounce";
import useGet from "@/hooks/useGet";
import apis from "@/config/apis";
import {
    cohortSearchDefaultValues,
    cohortSearchFilter,
} from "@/config/forms/cohortAccountSearch";
import { getColumns } from "./CohortTable.utils";

const TRANSLATION_PATH = `pages.account.profile.cohortDiscoveryAdmin`;

const CohortTable = () => {
    const t = useTranslations(TRANSLATION_PATH);

    const [currentPage, setCurrentPage] = useState(1);
    const [sort, setSort] = useState({ key: "updated_at", direction: "asc" });
    const [requestStatus, setRequestStatus] = useState<CohortRequestStatus>();

    const { control, watch, setValue } = useForm({
        defaultValues: cohortSearchDefaultValues,
    });

    const watchAll = watch();

    const searchDebounced = useDebounce(watchAll.search, 500);

    const queryParams = new URLSearchParams();
    queryParams.append("sort", `${sort.key}:${sort.direction}`);
    queryParams.append("page", currentPage.toString());
    if (requestStatus) {
        queryParams.append("request_status", requestStatus);
    }
    if (searchDebounced) {
        queryParams.append("text", searchDebounced);
    }

    const { data, isLoading } = useGet<PaginationType<CohortRequest>>(
        `${apis.cohortRequestsV1Url}?${queryParams}`,
        { withPagination: true, keepPreviousData: true }
    );

    const translations = {
        accountExpired: t("accountExpired"),
        expiryWarning: t("expiryWarning"),
        dateActionedTooltip: t("dateActionedTooltip"),
    };

    const { lastPage, list } = data || {};
    const columns = getColumns({
        setSort,
        sort,
        setRequestStatus,
        requestStatus,
        translations,
    });

    if (!list) return <Loading />;

    return (
        <>
            <Box sx={{ p: 0, width: "50%" }}>
                <InputWrapper
                    setValue={setValue}
                    control={control}
                    {...cohortSearchFilter}
                />
            </Box>
            <div style={{ marginBlock: 10 }}>
                <Table<CohortRequest> columns={columns} rows={list} />
            </div>
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

export default CohortTable;
