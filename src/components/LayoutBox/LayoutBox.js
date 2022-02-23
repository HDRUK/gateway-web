/** @jsx jsx */
import { cx } from '@emotion/css';
import { jsx } from '@emotion/react';
import { addCommonPropTypes } from '../../configs/propTypes';
import useCommonStyles from '../../hooks/useCommonStyles';

const LayoutBox = ({ children, mt, mb, ml, mr, width, minWidth, maxWidth }) => {
	const commonStyles = useCommonStyles({ mt, mb, ml, mr, width, minWidth, maxWidth });

	return <div className={cx('ui-LayoutBox', commonStyles)}>{children}</div>;
};

LayoutBox.propTypes = addCommonPropTypes({});

export default LayoutBox;
