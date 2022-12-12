import { cx } from '@emotion/css';
import CardHeader from '../Card/CardHeader';

const ModalHeader = ({ className, children, ...outerProps }) => {
    return (
        <CardHeader {...outerProps} className={cx(className, 'ui-ModalHeader')}>
            {children}
        </CardHeader>
    );
};

export default ModalHeader;
