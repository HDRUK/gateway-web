/** @jsx jsx */
import { jsx } from '@emotion/react';
import { cx } from '@emotion/css';
import PropTypes from 'prop-types';
import { PROP_TYPES_LAYOUTBOX } from '../LayoutBox/LayoutBox.propTypes';

import Card from '../Card';
import Dimmer from '../Dimmer';

const Modal = ({ children, className, minWidth, ...outerProps }) => {
    return (
        <Dimmer>
            <Card {...outerProps} className={cx(className, 'ui-Modal')} minWidth={minWidth}>
                {children}
            </Card>
        </Dimmer>
    );
};

Modal.propTypes = {
    dismissable: PropTypes.bool,
    onClose: PropTypes.func,
    minWidth: PropTypes.string,
    ...PROP_TYPES_LAYOUTBOX,
};

Modal.defaultProps = {
    dismissable: true,
    minWidth: '600px',
    onClose: () => {},
};

export default Modal;
