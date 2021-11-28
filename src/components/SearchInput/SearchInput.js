import PropTypes from 'prop-types';
import React from 'react';
import { omit } from '../../configs/propTypes';
import Icon from '../Icon';
import Input from '../Input';
import { PROP_TYPES_INPUT } from '../Input/Input.propTypes';

const SearchInput = ({ value, onReset, onSubmit, ...outerProps }) => {
	const inputRef = React.useRef(null);

	const handleReset = React.useCallback(
		e => {
			if (onReset) onReset(e, inputRef.current);
		},
		[inputRef.current]
	);

	const handleSubmit = React.useCallback(
		e => {
			if (onSubmit) onSubmit(e, inputRef.current);
		},
		[inputRef.current]
	);

	return (
		<Input
			name='search'
			inputRef={inputRef}
			iconPrepend={<Icon name='search' fill='green700' size='lg' role='button' onClick={handleSubmit} />}
			iconAppend={!!value && <Icon name='clear' color='purple500' size='lg' role='button' onClick={handleReset} />}
			value={value}
			{...outerProps}
		/>
	);
};

SearchInput.propTypes = {
	...omit(PROP_TYPES_INPUT, ['inputRef']),
	onReset: PropTypes.func,
	onSubmit: PropTypes.func,
};

SearchInput.defaultProps = {
	className: 'ui-SearchInput',
};

export default SearchInput;