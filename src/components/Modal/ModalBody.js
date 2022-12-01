/** @jsxRuntime classic */
/** @jsx jsx */
import { jsx } from '@emotion/react';
import { cx } from '@emotion/css';
import CardBody from '../Card/CardBody';

const ModalBody = ({ className, children, ...outerProps }) => {
    return (
        <CardBody {...outerProps} className={cx(className, 'ui-ModalBody')}>
            {children}
        </CardBody>
    );
};

export default ModalBody;
