import React from 'react';
import { CheckboxTree, SearchInput } from 'components';
import { Input, Button, Box } from 'hdruk-react-core';

const SearchFilters = ({ nodes = [], onClear, onReset, onCheck, onExpand }) => {
    const [checked, setChecked] = React.useState([]);
    const [expanded, setExpanded] = React.useState([]);
    const [searchValue, setSearchValue] = React.useState([]);

    const handleOnClear = () => {
        onClear();
    };

    const handleOnCheck = data => {
        setChecked(data);

        onCheck(data);
    };

    const handleOnExpand = data => {
        setExpanded(data);

        onExpand(data);
    };

    const handleOnChange = ({ target: { value } }) => {
        setSearchValue(value);
    };

    const handleOnReset = () => {
        setSearchValue('');

        onReset();
    };

    const filteredNodes = nodes
        .filter(({ label }) => {
            const pattern = new RegExp(searchValue, 'i');
            return pattern.test(label);
        })
        .map(({ label, value }) => {
            return {
                label,
                value: value || label,
            };
        });

    return (
        <>
            <SearchInput mb={3} onChange={handleOnChange} onReset={handleOnReset} value={searchValue} />
            <Button onClick={handleOnClear} mb={3}>
                Clear all
            </Button>
            <CheckboxTree
                nodes={filteredNodes}
                onCheck={handleOnCheck}
                onExpand={handleOnExpand}
                checked={checked}
                expanded={expanded}
                expandable={false}
            />
        </>
    );
};

SearchFilters.defaultProps = {
    onExpand: () => {},
    onCheck: () => {},
    onReset: () => {},
};

export default SearchFilters;
