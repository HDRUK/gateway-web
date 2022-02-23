/** @jsx jsx */
import { cx } from '@emotion/css';
import { css, jsx } from '@emotion/react';
import { Form, InputGroup } from 'react-bootstrap';
import PropTypes from 'prop-types';
import { addCommonPropTypes } from '../../configs/propTypes';
import useCommonStyles from '../../hooks/useCommonStyles';
import * as styles from './Textarea.styles';
import TextareaAutosize from 'react-textarea-autosize';

const Textarea = ({
	className,
	autosize,
	label,
	maxCharCount,
	charCountDescription,
	variant,
	value,
	mt,
	mb,
	ml,
	mr,
	width,
	minWidth,
	maxWidth,
	inputRef,
	id,
	rows,
	error,
	...outerProps
}) => {
	const commonStyles = useCommonStyles({ mt, mb, ml, mr, width, width, minWidth, maxWidth });

	return (
		<Form.Group controlId={id} className={cx('ui-Textarea', className, commonStyles)} css={styles.formGroup}>
			<Form.Label css={styles.label}>{label}</Form.Label>
			<InputGroup css={styles.inputGroup({ variant, rows, error })}>
				{!!maxCharCount && (
					<div className='ui-TextArea__charCount' css={styles.charCount}>
						{value.length} {charCountDescription}
						<span css={styles.charCountValue}>
							{' '}
							({value.length}/{maxCharCount})
						</span>
					</div>
				)}
				{autosize && <TextareaAutosize type='text' value={value} {...outerProps} ref={inputRef} />}
				{!autosize && <Form.Control as='textarea' {...outerProps} ref={inputRef} />}
			</InputGroup>
			{error && <div className='errorMessages'>{error}</div>}
		</Form.Group>
	);
};

Textarea.defaultProps = {
	autosize: false,
	variant: 'primary',
	charCountDescription: 'character limit',
	value: '',
	rows: 5,
};

Textarea.propTypes = addCommonPropTypes({
	label: PropTypes.node,
	error: PropTypes.node,
	placeholder: PropTypes.string,
	value: PropTypes.string,
	maxlength: PropTypes.number,
	maxCharCount: PropTypes.number,
	charCountDescription: PropTypes.node,
	onChange: PropTypes.func,
	inputRef: PropTypes.shape({ current: PropTypes.instanceOf(Element) }),
	variant: PropTypes.oneOf(['primary', 'secondary']),
	id: PropTypes.string,
	name: PropTypes.string,
	autosize: PropTypes.bool,
	rows: PropTypes.number,
});

export default Textarea;
