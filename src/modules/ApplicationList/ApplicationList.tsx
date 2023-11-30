import ApplicationListItem from "@/modules/ApplicationListItem";
import { Application } from "@/interfaces/Application";
import apis from "@/config/apis";
import useGet from "@/hooks/useGet";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import BoxContainer from "@/components/BoxContainer";
import { Box } from "@mui/material";
import Typography from "@/components/Typography";
import ApplicationSearchBar from "@/modules/ApplicationSearchBar";
import Pagination from "@/components/Pagination";
import { PaginationType } from "@/interfaces/Pagination";

const ApplicationList = () => {
    const [currentPage, setCurrentPage] = useState(1);
    const [filterQuery, setFilterQuery] = useState("");

    const router = useRouter();
    const { teamId } = router.query;

    const { data, isLoading } = useGet<PaginationType<Application>>(
        filterQuery
            ? `${apis.applicationsV1Url}?perPage=10&team_id=${teamId}&${filterQuery}&page=${currentPage}`
            : null,
        {
            keepPreviousData: true,
            withPagination: true,
        }
    );

    useEffect(() => {
        window.scrollTo({ top: 0 });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [currentPage]);

    const { lastPage, list, total } = data || {};

    const calculatedTotal = total || list?.length;

    return (
        <BoxContainer>
            <ApplicationSearchBar setFilterQuery={setFilterQuery} />

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
                page={currentPage}
                count={lastPage}
                onChange={(e: React.ChangeEvent<unknown>, page: number) =>
                    setCurrentPage(page)
                }
            />
        </BoxContainer>
    );
};

export default ApplicationList;
