/* eslint-disable */

/**
 ** TODO: RE-ENABLE LINTING WHEN WORKING ON FEATURE
 */

import { useEffect, useState } from "react";
import useAuth from "./useAuth";

// Pre-emptively added this waiting for the API to be ready
const useCustodianRoles = (teamId: number) => {
    const { auth } = useAuth();

    const [isTeamAdmin, setIsTeamAdmin] = useState(false);
    const [isTeamDeveloper, setIsTeamDeveloper] = useState(false);
    const [isMetadataManager, setIsMetadataManager] = useState(false);
    const [isMetadataEditor, setIsMetadataEditor] = useState(false);
    const [isDarManager, setIsDarManager] = useState(false);
    const [isDarReviewer, setIsDarReviewer] = useState(false);
    const [isHDRAdmin, setIsHDRAdmin] = useState(false);
    const [isHDRDar, setIsHDRDar] = useState(false);
    const [isHDRCustodian, setIsHDRCustodian] = useState(false);

    useEffect(() => {
        if (!teamId) return;

        // get team

        if (!team?.roles) return;

        const { roles } = team;

        // Set role
    }, [teamId]);

    return {
        isTeamAdmin,
        isTeamDeveloper,
        isMetadataManager,
        isMetadataEditor,
        isDarManager,
        isDarReviewer,
        isHDRAdmin,
        isHDRDar,
        isHDRCustodian,
    };
};

export default useCustodianRoles;
