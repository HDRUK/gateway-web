/** @jsx jsx */
import { jsx } from '@emotion/react';
import { cx } from '@emotion/css';
import PropTypes from 'prop-types';
import React from 'react';
import { PROP_TYPES_LAYOUTBOX } from '../LayoutBox/LayoutBox.propTypes';

import LayoutBox from '../LayoutBox';
import { ReactComponent as CloseIcon } from '../../images/close-alt.svg';
import * as styles from './Card.styles.js';
import Cta from '../Cta';
import Icon from '../Icon';

const Card = ({ onClose, children, mt, mb, ml, mr, width, minWidth, maxWidth, dismissable, className, open, ...outerProps }) => {
    const [show, setShow] = React.useState(true);

    const handleClose = React.useCallback(() => {
        setShow(false);

        onClose();
    }, []);

    React.useEffect(() => {
        setShow(open);
    }, [open]);

    return (
        show && (
            <LayoutBox {...{ mt, mb, ml, mr, width, minWidth, maxWidth }}>
                <div css={styles.root()} className={cx(className, 'ui-Card')} {...outerProps}>
                    {dismissable && (
                        <LayoutBox display='flex' justifyContent='flex-end' position='absolute' top='6px' right='6px'>
                            <Cta
                                size='large'
                                iconRight={<Icon svg={<CloseIcon />} size='lg' />}
                                color='purple700'
                                fill='purple700'
                                onClick={handleClose}
                            />
                        </LayoutBox>
                    )}
                    {children}
                </div>
            </LayoutBox>
        )
    );
};

Card.propTypes = {
    dismissable: PropTypes.bool,
    onClose: PropTypes.func,
    ...PROP_TYPES_LAYOUTBOX,
};

Card.defaultProps = {
    dismissable: false,
    onClose: () => {},
};

export default Card;
