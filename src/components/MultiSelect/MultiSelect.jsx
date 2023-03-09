import { theme } from 'configs/theme';
import PropTypes from 'prop-types';
import ReactSelect, { components } from 'react-select';

const Option = props => {
    const { data, isSelected } = props;

    return (
        <div>
            <components.Option {...props}>
                <div style={{ display: 'flex', alignItems: 'start', fontSize: '14px' }}>
                    <input
                        type='checkbox'
                        name='checkbox'
                        checked={isSelected}
                        onChange={() => null}
                        style={{ marginRight: '20px', cursor: 'pointer' }}
                    />
                    <label style={{ cursor: 'pointer' }} htmlFor='checkbox'>
                        <b>{data.label}</b> {data.description}
                    </label>
                </div>
            </components.Option>
        </div>
    );
};

const MultiSelect = ({ options, maxMenuHeight, onChange }) => {
    return (
        <>
            <ReactSelect
                styles={{
                    control: baseStyles => ({ ...baseStyles, backgroundColor: theme.colors.white, borderWidth: '2px' }),
                    option: (baseStyles, state) => ({
                        ...baseStyles,
                        cursor: 'pointer',
                        backgroundColor: state.isFocused ? theme.colors.grey200 : theme.colors.white,
                        color: theme.colors.grey800,
                        ':active': {
                            ...baseStyles[':active'],
                            backgroundColor: theme.colors.grey200,
                        },
                    }),
                    valueContainer: baseStyles => ({ ...baseStyles, fontSize: '14px' }),
                }}
                closeMenuOnSelect={false}
                isMulti
                options={options}
                hideSelectedOptions={false}
                components={{
                    Option,
                }}
                maxMenuHeight={maxMenuHeight}
                allowSelectAll
                onChange={onChange}
            />
        </>
    );
};

MultiSelect.propTypes = {
    options: PropTypes.arrayOf(PropTypes.shape({ label: PropTypes.string, description: PropTypes.string })).isRequired,
    maxMenuHeight: PropTypes.number,
    onChange: PropTypes.func.isRequired,
};

MultiSelect.defaultProps = {
    maxMenuHeight: 450,
};

Option.propTypes = {
    isSelected: PropTypes.bool.isRequired,
    selectOption: PropTypes.func.isRequired,
    // eslint-disable-next-line react/forbid-prop-types
    data: PropTypes.any.isRequired,
};

export default MultiSelect;
