import omit from 'lodash/omit';
import Typography from './Typography';
import { PROP_TYPES_TYPOGRAPHY } from './Typography.propTypes';

const Caption = props => <Typography {...props} variant='caption' />;

Caption.propTypes = omit(PROP_TYPES_TYPOGRAPHY, 'variant');

export default Caption;
