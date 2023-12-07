"use client";

import Table from "@/components/Table";
import useGet from "@/hooks/useGet";
import apis from "@/config/apis";
import { CohortRequest, CohortRequestStatus } from "@/interfaces/CohortRequest";
import Loading from "@/components/Loading";
import { useState } from "react";
import Pagination from "@/components/Pagination";
import { PaginationType } from "@/interfaces/Pagination";
import { getColumns } from "./CohortTable.utils";

const CohortTable = () => {
    const [currentPage, setCurrentPage] = useState(1);
    const [sort, setSort] = useState({ key: "created_at", direction: "asc" });
    const [requestStatus, setRequestStatus] = useState<CohortRequestStatus>();

    const queryParams = new URLSearchParams();
    queryParams.append("sort", `${sort.key}:${sort.direction}`);
    queryParams.append("page", currentPage.toString());
    if (requestStatus) {
        queryParams.append("request_status", requestStatus);
    }

    const { data, isLoading } = useGet<PaginationType<CohortRequest>>(
        `${apis.cohortRequestsV1Url}?${queryParams}`,
        { withPagination: true, keepPreviousData: true }
    );

    const { lastPage, list } = data || {};
    const columns = getColumns({
        setSort,
        sort,
        setRequestStatus,
        requestStatus,
    });

    if (!list) return <Loading />;

    return (
        <>
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
