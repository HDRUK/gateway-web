/** @jsx jsx */
import { jsx } from '@emotion/react';
import React from 'react';
import PropTypes from 'prop-types';
import { capitalize } from 'lodash';
import { Box, Caption } from 'hdruk-react-core';
import { useTranslation } from 'react-i18next';

const DeliveryLeadTime = ({ deliveryLeadTime }) => {
    const { t } = useTranslation();

    return (
        <Box data-testid='deliveryLeadTime' display='flex' justifyContent={{ sm: 'start', md: 'end' }}>
            <Caption color='grey600' mr='1'>
                {t('dataset.typicalTimeToAccess')}
            </Caption>
            <Caption weight='bold' color='grey600'>
                {deliveryLeadTime ? capitalize(deliveryLeadTime) : 'Not specified'}
            </Caption>
        </Box>
    );
};

DeliveryLeadTime.propTypes = {
    deliveryLeadTime: PropTypes.string.isRequired,
};

export default DeliveryLeadTime;
