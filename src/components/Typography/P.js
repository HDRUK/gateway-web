import omit from 'lodash/omit';
import Typography from './Typography';
import { PROP_TYPES_TYPOGRAPHY } from './Typography.propTypes';

const P = props => <Typography {...props} variant='body' />;

P.propTypes = omit(PROP_TYPES_TYPOGRAPHY, 'variant');

export default P;
