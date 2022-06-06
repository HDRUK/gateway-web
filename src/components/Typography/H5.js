import React from 'react';
import omit from 'lodash/omit';
import Typography from './Typography';
import { PROP_TYPES_TYPOGRAPHY } from './Typography.propTypes';

const H5 = props => <Typography {...props} variant='h5' />;

H5.propTypes = omit(PROP_TYPES_TYPOGRAPHY, 'variant');

export default H5;
