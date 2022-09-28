import React from 'react';

import { useAuth } from '../context/AuthContext';
import AdvancedSearchCohortDiscovery from '../pages/commonComponents/AdvancedSearchCohortDiscovery';

const GatewayAdvancedSearchCohortDiscovery = () => {
    const { userState } = useAuth();

    return <AdvancedSearchCohortDiscovery variant='horizontal' userProps={userState[0]} />;
};

export default GatewayAdvancedSearchCohortDiscovery;
