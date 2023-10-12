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


interface TeamWithIntegrations {
    id: string;
    federation: Integration[];
}

const IntegrationList = () => {
    const [currentPage, setCurrentPage] = useState(1);

    const router = useRouter();
    const { teamId } = router.query;

    const { data, isLoading } = useGet<TeamWithIntegrations[]>(
        `${apis.teamsV1Url}/${teamId}/federations`
    );
    
    useMemo(() => {
        window.scrollTo({ top: 0 });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [currentPage]);

    //const { lastPage, list, total } = data || {};
    const lastPage = 1;
    const total = 1;
    const list = data?.[0].federation;

    return (
        <BoxContainer>
            <Box
                data-testid="number-of-integrations"
                display="flex"
                justifyContent="flex-end">
                <Typography>  
                    Number of Integrations: <strong>{total}</strong>
                </Typography>
            </Box>
            {list?.map((integration, index) => (
                <IntegrationListItem
                    index={index + 1}
                    integration={integration}
                />
            ))}
        </BoxContainer>
    );
};

export default IntegrationList;
