import React, { useCallback, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Box, Button, FeatureContent, Tag, Typography } from 'hdruk-react-core';
import { useTranslation } from 'react-i18next';
import googleAnalytics from '../../../tracking';
import mediaUrl from '../../../images/feature-data-utility-wizard.png';
import { addCmsGatewayHostname } from '../../../configs/url.config';
import { useCms } from '../../../context/CmsContext';
import { CMS_ACTION_OPEN_DATA_UTILITY_MODAL } from '../../../configs/constants';

const AdvancedSearchDataUtilityWizard = ({ onClick, variant }) => {
    const { t } = useTranslation();
    const { data, resetData } = useCms();

    const handleClicked = useCallback(() => {
        googleAnalytics.recordVirtualPageView('Data utility wizard');
        googleAnalytics.recordEvent('Datasets', 'Clicked search using data utility wizard', 'Opened data utility wizard modal');

        onClick(1);
    }, []);

    useEffect(() => {
        if (data?.action === CMS_ACTION_OPEN_DATA_UTILITY_MODAL) {
            resetData();

            onClick(1);
        }
    }, [data]);

    return (
        <FeatureContent
            variant={variant}
            header={
                <Box display='flex' width='100%' alignItems='center'>
                    <Box flexGrow='1'>{t('search.advanced.dataUtilityWizard.title')}</Box>
                    <Tag variant='success' ml={2}>
                        {t('beta').toLocaleUpperCase()}
                    </Tag>
                </Box>
            }
            body={<Typography>{t('search.advanced.dataUtilityWizard.description')}</Typography>}
            media={<img src={addCmsGatewayHostname(mediaUrl)} alt={t('search.advanced.dataUtilityWizard.mediaAlt')} />}
            actions={
                <>
                    <Button variant='secondary' mb={3} onClick={handleClicked}>
                        {t('search.advanced.dataUtilityWizard.action')}
                    </Button>
                    <a href='https://www.healthdatagateway.org/about/data-utility-wizard' target='_blank' rel='noreferrer'>
                        <Typography color='purple500'>{t('learn.more')}</Typography>
                    </a>
                </>
            }
            width='100%'
        />
    );
};

AdvancedSearchDataUtilityWizard.defaultProps = {
    variant: 'vertical',
};

AdvancedSearchDataUtilityWizard.propTypes = {
    variant: PropTypes.oneOf(['horizontal', 'vertical']),
    onClick: PropTypes.func.isRequired,
};

export default AdvancedSearchDataUtilityWizard;
