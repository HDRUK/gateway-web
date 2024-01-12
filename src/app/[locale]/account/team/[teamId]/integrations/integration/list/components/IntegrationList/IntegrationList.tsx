"use client";

import { useMemo, useState } from "react";
import { Box } from "@mui/material";
import { useParams } from "next/navigation";
import { Integration } from "@/interfaces/Integration";
import { PaginationType } from "@/interfaces/Pagination";
import BoxContainer from "@/components/BoxContainer";
import Pagination from "@/components/Pagination";
import Typography from "@/components/Typography";
import useGet from "@/hooks/useGet";
import apis from "@/config/apis";
import IntegrationListItem from "../IntegrationListItem";

const IntegrationList = () => {
    const [currentPage, setCurrentPage] = useState(1);

    const params = useParams<{ teamId: string }>();

    const { data, isLoading } = useGet<PaginationType<Integration>>(
        `${apis.teamsV1Url}/${params?.teamId}/federations?per_page=10&page=${currentPage}`,
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
