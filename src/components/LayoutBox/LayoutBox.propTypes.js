import PropTypes from 'prop-types';
import { addCommonPropTypes } from '../../configs/propTypes';

export const PROP_TYPES_LAYOUTBOX = addCommonPropTypes({
    display: PropTypes.string,
    alignItems: PropTypes.string,
    justifyContent: PropTypes.string,
    p: PropTypes.number,
    pl: PropTypes.number,
    pb: PropTypes.number,
    pt: PropTypes.number,
    pr: PropTypes.number,
    flexGrow: PropTypes.string,
});
