/** @jsx jsx */
import { jsx } from '@emotion/react';
import React from 'react';
import PropTypes from 'prop-types';
import { capitalize } from 'lodash';
import { Box, Caption } from 'hdruk-react-core';

const DeliveryLeadTime = ({ deliveryLeadTime, label }) => {
    return (
        <Box display='flex' justifyContent={{ sm: 'start', md: 'end' }}>
            <Caption color='grey600' mr='1'>
                {label}
            </Caption>
            <Caption weight='bold' color='grey600'>
                {deliveryLeadTime ? capitalize(deliveryLeadTime) : 'Not specified'}
            </Caption>
        </Box>
    );
};

DeliveryLeadTime.propTypes = {
    deliveryLeadTime: PropTypes.string.isRequired,
    label: PropTypes.string.isRequired,
};

export default DeliveryLeadTime;
