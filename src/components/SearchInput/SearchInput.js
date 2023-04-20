import PropTypes from 'prop-types';
import { useRef, useCallback } from 'react';
import { Icon } from 'hdruk-react-core';
import { omit } from '../../configs/propTypes';
import Input from '../Input';
import { ReactComponent as SearchIcon } from '../../images/search.svg';
import { ReactComponent as ClearIcon } from '../../images/clear.svg';
import { PROP_TYPES_INPUT } from '../Input/Input.propTypes';
import { PROP_TYPES_LAYOUTBOX } from '../LayoutBox/LayoutBox.propTypes';

const SearchInput = ({ value, onReset, ...outerProps }) => {
    const inputRef = useRef(null);

    const handleReset = useCallback(
        e => {
            if (onReset) onReset(e, inputRef.current);
        },
        [inputRef.current]
    );

    return (
        <Input
            name='search'
            inputRef={inputRef}
            iconPrepend={<Icon svg={<SearchIcon />} fill='green700' size='lg' />}
            iconAppend={!!value && <Icon svg={<ClearIcon />} fill='purple500' size='lg' role='button' onClick={handleReset} />}
            value={value}
            {...outerProps}
        />
    );
};

SearchInput.propTypes = {
    ...omit(PROP_TYPES_INPUT, ['inputRef']),
    onReset: PropTypes.func,
    ...PROP_TYPES_LAYOUTBOX,
};

SearchInput.defaultProps = {
    className: 'ui-SearchInput',
    onReset: null,
};

export default SearchInput;
