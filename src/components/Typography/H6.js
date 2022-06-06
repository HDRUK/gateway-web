import React from 'react';
import omit from 'lodash/omit';
import Typography from './Typography';
import { PROP_TYPES_TYPOGRAPHY } from './Typography.propTypes';

const H6 = props => <Typography {...props} variant='h6' />;

H6.propTypes = omit(PROP_TYPES_TYPOGRAPHY, 'variant');

export default H6;
