"use client";

import Box from "@/components/Box";
import ImageMediaCard from "@/components/ImageMediaCard";
import Typography from "@/components/Typography";

import { useRouter } from "next/router";
import { AccountTeamUrlQuery } from "@/interfaces/AccountTeamQuery";

const ApiManagement = () => {
    const { query } = useRouter();
    const { teamId } = query as AccountTeamUrlQuery;

    return (
        <Box
            sx={{
                gridColumn: { tablet: "span 3", laptop: "span 4" },
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
            }}>
            <Box sx={{ display: "flex", gap: "40px" }}>
                <ImageMediaCard
                    img="/images/account/teams/api-management/create.jpg"
                    href={`/account/team/${teamId}/integrations/api-management/create`}
                    description="Create API-keys and link to the Gateway"
                    buttonText="Create API-Key"
                />
                <ImageMediaCard
                    img="/images/account/teams/api-management/manage.jpg"
                    href={`/account/team/${teamId}/integrations/api-management/list`}
                    description="Manage your linked APIs"
                    buttonText="Manage API"
                />
            </Box>
            <Typography sx={{ fontSize: "20px" }}>
                HDR UK cannot create application registrations on behalf of
                users
            </Typography>
        </Box>
    );
};

export default ApiManagement;
