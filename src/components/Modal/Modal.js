/** @jsx jsx */
import { jsx } from '@emotion/react';
import { cx } from '@emotion/css';
import PropTypes from 'prop-types';
import React from 'react';
import { PROP_TYPES_LAYOUTBOX } from '../LayoutBox/LayoutBox.propTypes';

import Card from '../Card';
import Dimmer from '../Dimmer';
import LayoutBox from '../LayoutBox';
import Cta from '../Cta';
import { ReactComponent as CloseIcon } from '../../images/close-alt.svg';
import * as styles from './Modal.styles';

const Modal = ({ children, className, width, dismissable, onClose, open, height, position, ...outerProps }) => {
    const [show, setShow] = React.useState(true);

    const handleClose = React.useCallback(() => {
        setShow(false);

        onClose();
    }, []);

    React.useEffect(() => {
        setShow(open);
    }, [open]);

    return show ? (
        <Dimmer onClick={handleClose} contentAlignment={position}>
            <Card {...outerProps} className={cx(className, 'ui-Modal')} css={styles.card} width={width} height={height}>
                {dismissable && (
                    <LayoutBox css={styles.closeButton} display='flex' justifyContent='flex-end' position='absolute'>
                        <Cta iconRight={<CloseIcon />} color='purple700' fill='purple700' onClick={handleClose} />
                    </LayoutBox>
                )}
                {children}
            </Card>
        </Dimmer>
    ) : (
        ''
    );
};

Modal.propTypes = {
    dismissable: PropTypes.bool,
    onClose: PropTypes.func,
    width: PropTypes.string,
    height: PropTypes.string,
    position: PropTypes.oneOf(['top', 'center']),
    ...PROP_TYPES_LAYOUTBOX,
};

Modal.defaultProps = {
    dismissable: true,
    width: '600px',
    height: null,
    position: 'top',
    onClose: () => {},
};

export default Modal;
