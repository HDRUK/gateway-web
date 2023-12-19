"use client";

import Box from "@/components/Box";
import ImageMediaCard from "@/components/ImageMediaCard";
import Typography from "@/components/Typography";
import { RouteName } from "@/consts/routeName";

import { useParams } from "next/navigation";

const ApiManagement = () => {
    const { teamId } = useParams();

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
                    href={`/${RouteName.ACCOUNT}/${RouteName.TEAM}/${teamId}/${RouteName.INTEGRATIONS}/${RouteName.API_MANAGEMENT}/${RouteName.CREATE}`}
                    description="Create API-keys and link to the Gateway"
                    buttonText="Create API-Key"
                />
                <ImageMediaCard
                    img="/images/account/teams/api-management/manage.jpg"
                    href={`/${RouteName.ACCOUNT}/${RouteName.TEAM}/${teamId}/${RouteName.INTEGRATIONS}/${RouteName.API_MANAGEMENT}/${RouteName.LIST}`}
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
