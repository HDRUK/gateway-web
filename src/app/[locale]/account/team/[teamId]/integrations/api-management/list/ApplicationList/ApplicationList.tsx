"use client";

import { useEffect, useState } from "react";
import { Box } from "@mui/material";
import { useParams } from "next/navigation";
import { Application } from "@/interfaces/Application";
import { PaginationType } from "@/interfaces/Pagination";
import BoxContainer from "@/components/BoxContainer";
import Pagination from "@/components/Pagination";
import Typography from "@/components/Typography";
import useGet from "@/hooks/useGet";
import apis from "@/config/apis";
import ApplicationListItem from "./ApplicationListItem";
import ApplicationSearchBar from "./ApplicationSearchBar";

const ApplicationList = () => {
    const params = useParams<{
        teamId: string;
    }>();

    const [queryParams, setQueryParams] = useState({
        team_id: `${params?.teamId}`,
        status: "",
        text: "",
        page: "1",
        per_page: "10",
    });

    const { data, isLoading } = useGet<PaginationType<Application>>(
        `${apis.applicationsV1Url}?${new URLSearchParams(queryParams)}`,
        {
            keepPreviousData: true,
            withPagination: true,
        }
    );

    useEffect(() => {
        window.scrollTo({ top: 0 });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [queryParams.page]);

    const { lastPage, list, total } = data || {};

    const calculatedTotal = total || list?.length;

    return (
        <BoxContainer>
            <ApplicationSearchBar setQueryParams={setQueryParams} />

            <Box
                data-testid="number-of-apps"
                display="flex"
                justifyContent="flex-end">
                <Typography>
                    Number of Apps: <strong>{calculatedTotal}</strong>
                </Typography>
            </Box>
            {list?.map(application => (
                <ApplicationListItem
                    key={application.id}
                    application={application}
                />
            ))}
            <Pagination
                isLoading={isLoading}
                page={parseInt(queryParams.page, 10)}
                count={lastPage}
                onChange={(e: React.ChangeEvent<unknown>, page: number) =>
                    setQueryParams({ ...queryParams, page: page.toString() })
                }
            />
        </BoxContainer>
    );
};

export default ApplicationList;
