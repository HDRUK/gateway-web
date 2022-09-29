import React, { useCallback } from 'react';
import { addCmsGatewayHostname } from '../../configs/url.config';
import { CMS_ACTION_OPEN_DATA_UTILITY_MODAL } from '../../configs/constants';
import AdvancedSearchDataUtilityWizard from '../../pages/commonComponents/AdvancedSearchDataUtilityWizard';
import { useCms } from '../../context/CmsContext';

const GatewayAdvancedSearchDataUtilityWizard = () => {
    const { setData } = useCms();

    const handleClick = useCallback(() => {
        setData({
            action: CMS_ACTION_OPEN_DATA_UTILITY_MODAL,
        });

        window.location.href = addCmsGatewayHostname('/search=&tab=datasets');
    }, []);

    return <AdvancedSearchDataUtilityWizard variant='horizontal' onClick={handleClick} />;
};

export default GatewayAdvancedSearchDataUtilityWizard;
