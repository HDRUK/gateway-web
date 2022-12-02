import omit from 'lodash/omit';
import Typography from './Typography';
import { PROP_TYPES_TYPOGRAPHY } from './Typography.propTypes';

const H1 = props => <Typography {...props} variant='h1' />;

H1.propTypes = omit(PROP_TYPES_TYPOGRAPHY, 'variant');

export default H1;
