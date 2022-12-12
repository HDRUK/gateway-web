import React from 'react';
import omit from 'lodash/omit';
import Typography from './Typography';
import { PROP_TYPES_TYPOGRAPHY } from './Typography.propTypes';

const H2 = props => <Typography {...props} variant='h2' />;

H2.propTypes = omit(PROP_TYPES_TYPOGRAPHY, 'variant');

export default H2;
