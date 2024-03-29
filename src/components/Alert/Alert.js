/** @jsxImportSource @emotion/react */
import { useState, useCallback, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Box } from 'hdruk-react-core';
import Icon from '../Icon';
import { ReactComponent as CloseIcon } from '../../images/icons/clear.svg';
import { ReactComponent as CheckIcon } from '../../images/icons/tick.svg';
import { ReactComponent as DangerIcon } from '../../images/icons/danger.svg';
import { ReactComponent as InfoIcon } from '../../images/icons/info.svg';
import { PROP_TYPES_LAYOUTBOX } from '../LayoutBox/LayoutBox.propTypes';

import * as styles from './Alert.styles';

const Alert = ({
    icon,
    variant,
    onClose,
    children,
    mt,
    mb,
    ml,
    mr,
    width,
    minWidth,
    maxWidth,
    dismissable,
    autoclose,
    autocloseDuration,
    ...outerProps
}) => {
    const [show, setShow] = useState(true);

    const handleClose = useCallback(() => {
        setShow(false);

        onClose();
    }, []);

    useEffect(() => {
        if (show && autoclose) {
            const showTimeout = setTimeout(() => {
                handleClose();
            }, autocloseDuration);

            return () => {
                clearTimeout(showTimeout);
            };
        }
    }, [show, autoclose]);

    return (
        show && (
            <Box {...{ mt, mb, ml, mr, width, minWidth, maxWidth }}>
                <div css={styles.root({ variant })} {...outerProps}>
                    <div css={styles.icon} className='ui-Alert__icon'>
                        {icon}
                        {!icon && variant === 'success' && <Icon svg={<CheckIcon fill='inherit' />} />}
                        {!icon && variant === 'danger' && <Icon svg={<DangerIcon fill='inherit' />} size='lg' />}
                        {!icon && variant === 'warning' && <Icon svg={<DangerIcon fill='inherit' />} size='lg' />}
                        {!icon && variant === 'info' && <Icon svg={<InfoIcon fill='inherit' />} size='lg' />}
                    </div>
                    <div css={styles.content}>{children}</div>
                    {dismissable && (
                        <div css={styles.dismiss} className='ui-Alert__dismiss'>
                            <Icon svg={<CloseIcon fill='inherit' />} onClick={handleClose} role='button' size='lg' />
                        </div>
                    )}
                </div>
            </Box>
        )
    );
};

Alert.propTypes = {
    autoclose: PropTypes.bool,
    autocloseDuration: PropTypes.number,
    dismissable: PropTypes.bool,
    onClose: PropTypes.func,
    variant: PropTypes.oneOf(['success', 'warning', 'info', 'danger']).isRequired,
    ...PROP_TYPES_LAYOUTBOX,
};

Alert.defaultProps = {
    autoclose: false,
    autocloseDuration: 10000,
    dismissable: false,
    className: 'ui-Alert',
    onClose: () => {},
};

export default Alert;
