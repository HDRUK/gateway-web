import { CMS_ACTION_OPEN_DATA_UTILITY_MODAL } from 'configs/constants';
import React, { useCallback } from 'react';
import Cookies from 'js-cookie';
import { addCmsGatewayHostname } from '../configs/url.config';
import AdvancedSearchDataUtilityWizard from '../pages/commonComponents/AdvancedSearchDataUtilityWizard';

const CMSAdvancedSearchDataUtilityWizard = () => {
    const handleClick = useCallback(() => {
        Cookies.set(
            'cmsData',
            JSON.stringify({
                action: CMS_ACTION_OPEN_DATA_UTILITY_MODAL,
            }),
            { domain: window.location.hostname }
        );

        window.location.href = addCmsGatewayHostname('/search=&tab=datasets');
    }, []);

    return <AdvancedSearchDataUtilityWizard variant='horizontal' onClick={handleClick} />;
};

export default CMSAdvancedSearchDataUtilityWizard;
