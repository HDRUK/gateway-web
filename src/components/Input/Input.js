/** @jsx jsx */
import { cx } from '@emotion/css';
import { css, jsx } from '@emotion/react';
import debounce from 'lodash/debounce';
import React, { useCallback, useRef } from 'react';
import { Form, InputGroup } from 'react-bootstrap';
import useDOMChanged from '../../hooks/useDOMChanged';
import LayoutBox from '../LayoutBox';
import { PROP_TYPES_INPUT } from './Input.propTypes';
import { PROP_TYPES_LAYOUTBOX } from '../LayoutBox/LayoutBox.propTypes';
import * as styles from './Input.styles';

const Input = ({
	iconPrepend,
	iconAppend,
	textPrepend,
	textAppend,
	onDebounce,
	onChange,
	debounceDelay,
	inputRef,
	className,
	children,
	ml,
	mr,
	mb,
	mt,
	width,
	minWidth,
	maxWidth,
	variant,
	label,
	id,
	size,
	error,
	...outerProps
}) => {
	const prependRef = useRef(null);
	const appendRef = useRef(null);

	const domPrependChanged = useDOMChanged(prependRef);
	const domAppendChanged = useDOMChanged(appendRef);

	const handleDebounced = useCallback(debounce(onDebounce, debounceDelay), [onDebounce]);

	const handleChange = React.useCallback(e => {
		if (onChange) onChange(e);
		if (handleDebounced) handleDebounced(e);
	}, []);

	return (
		<LayoutBox {...{ mt, mb, ml, mr, width, minWidth, maxWidth }}>
			<Form.Group controlId={id} css={styles.formGroup}>
				{label && <Form.Label css={styles.label}>{label}</Form.Label>}
				<InputGroup
					css={styles.inputGroup({ prepend: domPrependChanged, append: domAppendChanged, variant, size, error })}
					className={cx('ui-Input', className)}>
					{(iconPrepend || textPrepend) && (
						<InputGroup.Prepend
							css={css`
								${styles.decorators};
								${styles.prepend};
							`}
							ref={prependRef}>
							{textPrepend && <InputGroup.Text>{textPrepend}</InputGroup.Text>}
							{iconPrepend}
						</InputGroup.Prepend>
					)}
					{!children && <Form.Control {...outerProps} onChange={handleChange} ref={inputRef} />}
					{children}
					{(iconAppend || textAppend) && (
						<InputGroup.Append
							css={css`
								${styles.decorators};
								${styles.append};
							`}
							ref={appendRef}>
							{iconAppend}
							{textAppend && <InputGroup.Text>{textAppend}</InputGroup.Text>}
						</InputGroup.Append>
					)}
				</InputGroup>
				{error && <div className='errorMessages'>{error}</div>}
			</Form.Group>
		</LayoutBox>
	);
};

Input.propTypes = {
	PROP_TYPES_INPUT,
	...PROP_TYPES_LAYOUTBOX,
};

Input.defaultProps = {
	size: 'default',
	variant: 'primary',
	debounceDelay: 300,
	onDebounce: () => {},
};

export default Input;
