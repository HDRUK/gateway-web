/** @jsx jsx */
import { jsx } from '@emotion/react';
import React from 'react';
import PropTypes from 'prop-types';
import { capitalize } from 'lodash';
import { Box, Caption } from 'hdruk-react-core';
import * as styles from './DeliveryLeadTime.styles';

const DeliveryLeadTime = ({ deliveryLeadTime, label }) => {
    return (
        <Box display='flex' justifyContent='start' css={styles.typicalTimeToAccess}>
            <Caption color='grey600' mr='1'>
                {label}
            </Caption>
            <Caption color='grey600' css={styles.deliveryLeadTime}>
                {capitalize(deliveryLeadTime)}
            </Caption>
        </Box>
    );
};

DeliveryLeadTime.propTypes = {
    deliveryLeadTime: PropTypes.string.isRequired,
    label: PropTypes.string.isRequired,
};

export default DeliveryLeadTime;
