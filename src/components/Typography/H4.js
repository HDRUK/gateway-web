import omit from 'lodash/omit';
import Typography from './Typography';
import { PROP_TYPES_TYPOGRAPHY } from './Typography.propTypes';

const H4 = props => <Typography {...props} variant='h4' />;

H4.propTypes = omit(PROP_TYPES_TYPOGRAPHY, 'variant');

export default H4;
