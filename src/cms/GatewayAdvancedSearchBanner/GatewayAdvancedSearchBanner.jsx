import React from 'react';
import { H4 } from 'hdruk-react-core';
import { useTranslation } from 'react-i18next';
import GatewayAdvancedSearchDataUtilityWizard from './GatewayAdvancedSearchDataUtilityWizard';
import GatewayAdvancedSearchCohortDiscovery from './GatewayAdvancedSearchCohortDiscovery';

const GatewayAdvancedSearchBanner = () => {
    const { t } = useTranslation();

    return (
        <>
            <H4 mb={6}>{t('cms.advancedSearch.banner.title')}</H4>
            <div className='row gx-5'>
                <div className='col-sm-6'>
                    <GatewayAdvancedSearchDataUtilityWizard />
                </div>
                <div className='col-sm-6'>
                    <GatewayAdvancedSearchCohortDiscovery />
                </div>
            </div>
        </>
    );
};

export default GatewayAdvancedSearchBanner;
