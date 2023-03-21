/** @jsxImportSource @emotion/react */
import { useEffect, useState } from 'react';

import { IconButton } from 'hdruk-react-core';
import PropTypes from 'prop-types';
import * as styles from './BackToTop.styles';

import { ReactComponent as ChevronUpIcon } from '../../images/icons/chevron-up.svg';

const BackToTop = ({ scrollOffset, size, variant, className }) => {
    const [showButton, setShowButton] = useState(false);

    useEffect(() => {
        window.addEventListener('scroll', () => {
            setShowButton(window.scrollY > scrollOffset);
        });
    }, []);

    const jumpToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth',
        });
    };

    return showButton ? (
        <div title='Back to top' className={className} css={styles.root}>
            <IconButton onClick={jumpToTop} variant={variant} size={size} svg={<ChevronUpIcon />} />
        </div>
    ) : null;
};

BackToTop.propTypes = {
    scrollOffset: PropTypes.number,
    variant: PropTypes.oneOf(['primary', 'secondary', 'tertiary']),
    size: PropTypes.oneOf(['xxs', 'xs', 'sm', 'md', 'default', 'lg', 'xl', '2xl', '3xl', '4xl', '5xl', 'contained']),
    className: PropTypes.string,
};

BackToTop.defaultProps = {
    scrollOffset: 100,
    size: 'xs',
    variant: 'secondary',
    className: '',
};

export default BackToTop;
