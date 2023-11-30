"use client";

import IntegrationListItem from "@/modules/IntegrationListItem";
import { Integration } from "@/interfaces/Integration";
import apis from "@/config/apis";
import useGet from "@/hooks/useGet";
import { useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import BoxContainer from "@/components/BoxContainer";
import { Box } from "@mui/material";
import Typography from "@/components/Typography";
import Pagination from "@/components/Pagination";
import { PaginationType } from "@/interfaces/Pagination";

const IntegrationList = () => {
    const [currentPage, setCurrentPage] = useState(1);

    const searchParams = useSearchParams();
    const teamId = searchParams.get("teamId") as string;

    const { data, isLoading } = useGet<PaginationType<Integration>>(
        `${apis.teamsV1Url}/${teamId}/federations?per_page=10&page=${currentPage}`,
        {
            keepPreviousData: true,
            withPagination: true,
        }
    );

    useMemo(() => {
        window.scrollTo({ top: 0 });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [currentPage]);

    const { lastPage, list, total, from } = data || {};

    const calculatedTotal = total || list?.length;
    const startIndex = from || 1;

    return (
        <BoxContainer>
            <Box
                data-testid="number-of-integrations"
                display="flex"
                justifyContent="flex-end">
                <Typography>
                    Number of Integrations: <strong>{calculatedTotal}</strong>
                </Typography>
            </Box>
            {list?.map((integration, index) => (
                <IntegrationListItem
                    key={integration.id}
                    index={index + startIndex}
                    integration={integration}
                />
            ))}
            <Pagination
                isLoading={isLoading}
                page={currentPage}
                count={lastPage}
                onChange={(e: React.ChangeEvent<unknown>, page: number) =>
                    setCurrentPage(page)
                }
            />
        </BoxContainer>
    );
};

export default IntegrationList;
