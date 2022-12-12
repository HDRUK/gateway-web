import { useCallback } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useCms } from '../../context/CmsContext';
import { addCmsGatewayHostname } from '../../configs/url.config';
import { CMS_ACTION_OPEN_COHORT_DISCOVERY_MODAL } from '../../configs/constants';
import AdvancedSearchCohortDiscovery from '../../pages/commonComponents/AdvancedSearchCohortDiscovery';

const GatewayAdvancedSearchCohortDiscovery = () => {
    const { userState } = useAuth();
    const { setData } = useCms();

    const handleClick = useCallback(() => {
        setData({
            action: CMS_ACTION_OPEN_COHORT_DISCOVERY_MODAL,
        });

        window.location.assign(addCmsGatewayHostname('search=&tab=datasets'));
    }, []);

    return <AdvancedSearchCohortDiscovery variant='horizontal' userProps={userState[0]} onClick={handleClick} />;
};

export default GatewayAdvancedSearchCohortDiscovery;
