/** @jsxRuntime classic */
/** @jsx jsx */
import { jsx } from '@emotion/react';
import PropTypes from 'prop-types';
import * as styles from './Link.styles';

const Link = ({ href, isExternal, children, ...outerProps }) => {
    return (
        <a css={styles.root} {...(isExternal && { rel: 'noopener noreferrer', target: '_blank' })} href={href} {...outerProps}>
            {children}
        </a>
    );
};

Link.propTypes = {
    href: PropTypes.string.isRequired,
    isExternal: PropTypes.bool,
    children: PropTypes.node.isRequired,
};

Link.defaultProps = {
    isExternal: false,
};

export default Link;
