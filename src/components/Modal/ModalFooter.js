/** @jsxRuntime classic */
/** @jsx jsx */
import { jsx } from '@emotion/react';
import { cx } from '@emotion/css';
import CardFooter from '../Card/CardFooter';

const ModalFooter = ({ className, children, ...outerProps }) => {
    return (
        <CardFooter {...outerProps} className={cx(className, 'ui-ModalFooter')}>
            {children}
        </CardFooter>
    );
};

export default ModalFooter;
