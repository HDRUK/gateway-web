import { Box } from 'hdruk-react-core';
import React from 'react';
import PropTypes from 'prop-types';

const LayoutContent = ({ children, ...outerProps }) => (
    <Box
        mb={4}
        display={{
            xxs: 'block',
            md: 'grid',
        }}
        gridTemplateRows='1fr'
        width='100%'
        gridTemplateColumns='8.3% 1fr 8.3%'
        {...outerProps}>
        <div />
        <div>{children}</div>
        <div />
    </Box>
);

LayoutContent.defaultProps = {
    children: null,
};

LayoutContent.propTypes = {
    children: PropTypes.node,
};

export default LayoutContent;
