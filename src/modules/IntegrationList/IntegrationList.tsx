import IntegrationListItem from "@/modules/IntegrationListItem";
import { Integration } from "@/interfaces/Integration";
import apis from "@/config/apis";
import useGet from "@/hooks/useGet";
import { useMemo, useState } from "react";
import { useRouter } from "next/router";
import BoxContainer from "@/components/BoxContainer";
import { Box, listSubheaderClasses } from "@mui/material";
import Typography from "@/components/Typography";
import ApplicationSearchBar from "@/modules/ApplicationSearchBar";
import Pagination from "@/components/Pagination";
import { PaginationType } from "@/interfaces/Pagination";

const IntegrationList = () => {
    const [currentPage, setCurrentPage] = useState(1);
    const [filterQuery, setFilterQuery] = useState("");

    const router = useRouter();
    const { teamId } = router.query;

    /*const { data, isLoading } = useGet<PaginationType<Integration>>(
        filterQuery
            ? `${apis.teamsV1Url}/${teamId}/federations`//?${filterQuery}&page=${currentPage}`
            : null,
        {
            keepPreviousData: true,
            withPagination: true,
        }
    );*/
    const { data, isLoading } = useGet<Integration[]>(`${apis.teamsV1Url}/${teamId}/federations`);

    console.log(data);

    useMemo(() => {
        window.scrollTo({ top: 0 });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [currentPage]);


    //turn back on for pagination
    //const { lastPage, list, total } = data || {};
    let lastPage = 1;
    let list = data;
    let total = list?.length;

    return (
        <BoxContainer>
            {/*<ApplicationSearchBar setFilterQuery={setFilterQuery} />*/}

            <Box
                data-testid="number-of-integrations"
                display="flex"
                justifyContent="flex-end">
                <Typography>
                    Number of Integrations: <strong>{total}</strong>
                </Typography>
            </Box>
            {list?.map((integration,index) => (
                <IntegrationListItem
                    index={index+1}
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
