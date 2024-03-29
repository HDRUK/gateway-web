import omit from 'lodash/omit';
import Typography from './Typography';
import { PROP_TYPES_TYPOGRAPHY } from './Typography.propTypes';

const H3 = props => <Typography {...props} variant='h3' />;

H3.propTypes = omit(PROP_TYPES_TYPOGRAPHY, 'variant');

export default H3;
