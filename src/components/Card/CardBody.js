/** @jsxImportSource @emotion/react */
import { cx } from '@emotion/css';
import * as styles from './Card.styles.js';

const CardBody = ({ className, children, ...outerProps }) => {
    return (
        <div className={cx(className, 'ui-CardBody')} css={styles.cardBody()} {...outerProps}>
            {children}
        </div>
    );
};

export default CardBody;
