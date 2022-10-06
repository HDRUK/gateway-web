import React from 'react';
import { Box, H4 } from 'hdruk-react-core';
import { useTranslation } from 'react-i18next';
import GatewayAdvancedSearchDataUtilityWizard from '../GatewayAdvancedSearchDataUtilityWizard';
import GatewayAdvancedSearchCohortDiscovery from '../GatewayAdvancedSearchCohortDiscovery';

const GatewayAdvancedSearchBanner = () => {
    const { t } = useTranslation();

    return (
        <>
            <H4 mb={6}>{t('cms.advancedSearch.banner.title')}</H4>
            <Box
                display='flex'
                flexDirection={{
                    xs: 'column',
                    md: 'row',
                }}
                width={{
                    xs: '100%',
                }}
                maxWidth={{
                    md: '1280px',
                }}
                gap={7}>
                <Box
                    width={{
                        md: 'calc(50% - 14px)',
                    }}>
                    <GatewayAdvancedSearchDataUtilityWizard />
                </Box>
                <Box
                    width={{
                        md: 'calc(50% - 14px)',
                    }}>
                    <GatewayAdvancedSearchCohortDiscovery />
                </Box>
            </Box>
        </>
    );
};

export default GatewayAdvancedSearchBanner;
