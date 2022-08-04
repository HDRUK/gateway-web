/** @jsx jsx */
import { cx } from '@emotion/css';
import { jsx } from '@emotion/react';
import Icon from '../Icon';
import useCommonStyles from '../../hooks/useCommonStyles';
import { ReactComponent as CheckIcon } from '../../images/icons/tick.svg';
import { ReactComponent as DangerIcon } from '../../images/icons/danger.svg';
import { ReactComponent as InfoIcon } from '../../images/icons/info.svg';
import * as styles from './AlertMessage.styles';

const AlertMessage = ({ className, children, ml, mr, mb, mt, m, width, minWidth, maxWidth, variant, icon, ...outerProps }) => {
    const commonStyles = useCommonStyles({
        mt,
        mb,
        ml,
        mr,
        m,
        width,
        minWidth,
        maxWidth,
    });

    return (
        <div {...outerProps} className={cx(commonStyles, className, 'ui-AlertMessage')} css={[commonStyles, styles.root({ variant })]}>
            <span css={[styles.icon()]}>
                {icon}
                {!icon && variant === 'success' && <Icon svg={<CheckIcon fill='inherit' />} />}
                {!icon && variant === 'danger' && <Icon svg={<DangerIcon fill='inherit' />} size='lg' />}
                {!icon && variant === 'warning' && <Icon svg={<DangerIcon fill='inherit' />} size='lg' />}
                {!icon && variant === 'info' && <Icon svg={<InfoIcon fill='inherit' />} size='lg' />}
            </span>
            <div>{children}</div>
        </div>
    );
};

export default AlertMessage;
