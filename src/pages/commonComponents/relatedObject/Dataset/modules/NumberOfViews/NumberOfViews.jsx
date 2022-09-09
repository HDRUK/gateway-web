/** @jsx jsx */
import { jsx } from '@emotion/react';
import React from 'react';
import PropTypes from 'prop-types';
import { Box, Caption } from 'hdruk-react-core';
import { useTranslation } from 'react-i18next';

const NumberOfViews = ({ count }) => {
    const { t } = useTranslation();

    return (
        <Box data-testid='numberOfViews' display='flex'>
            <Caption color='grey600'>{t('dataset.numberOfViews.viewed')}&nbsp;</Caption>
            <Caption weight='bold' color='grey600'>
                {count}
            </Caption>
            <Caption color='grey600'>&nbsp;{t('dataset.numberOfViews.times')}</Caption>
        </Box>
    );
};

NumberOfViews.propTypes = {
    count: PropTypes.number.isRequired,
};

export default NumberOfViews;
