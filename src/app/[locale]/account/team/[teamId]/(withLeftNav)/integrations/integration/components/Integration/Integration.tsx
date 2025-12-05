"use client";

import Box from "@/components/Box";
import ImageMediaCard from "@/components/ImageMediaCard";
import { StaticImages } from "@/config/images";
import { RouteName } from "@/consts/routeName";

const Integration = ({ teamId }: { teamId: string }) => {
    return (
        <Box sx={{ display: "flex", gap: "40px" }}>
            <ImageMediaCard
                img={StaticImages.TEAM_INTEGRATIONS.createNewIntegration}
                href={`/${RouteName.ACCOUNT}/${RouteName.TEAM}/${teamId}/${RouteName.INTEGRATIONS}/${RouteName.INTEGRATION}/${RouteName.CREATE}`}
                buttonText="Create new Integration"
            />
            <ImageMediaCard
                img={StaticImages.TEAM_INTEGRATIONS.manageIntegrations}
                href={`/${RouteName.ACCOUNT}/${RouteName.TEAM}/${teamId}/${RouteName.INTEGRATIONS}/${RouteName.INTEGRATION}/${RouteName.LIST}`}
                buttonText="Manage Integrations"
            />
        </Box>
    );
};

export default Integration;
