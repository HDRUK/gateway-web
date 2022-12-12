/** @jsx jsx */
import { cx } from '@emotion/css';
import { jsx } from '@emotion/react';
import PropTypes from 'prop-types';
import React from 'react';
import { Button } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import Dropdown from '../Dropdown';
import { PROP_TYPES_DROPDOWN } from '../Dropdown/Dropdown.propTypes';
import Icon from '../Icon';
import { ReactComponent as SortDescIcon } from '../../images/sort-desc.svg';
import { ReactComponent as SortAscIcon } from '../../images/sort-asc.svg';
import * as styles from './SortDropdown.styles';

const SortDropdown = ({ onSort, className, options, value, direction, allowDirection, ...outerProps }) => {
    const { t } = useTranslation();
    const [state, setState] = React.useState({
        value,
        direction,
    });

    const handleSort = React.useCallback(
        value => {
            const newState = {
                ...state,
                value,
            };

            setState(newState);
            onSort(newState);
        },
        [state]
    );

    const handleOrder = React.useCallback(() => {
        const direction = state.direction === 'asc' ? 'desc' : 'asc';
        const newState = {
            ...state,
            direction,
        };

        setState(newState);
        onSort(newState);
    }, [state]);

    React.useEffect(() => {
        setState({
            value,
            direction,
        });
    }, [value, direction]);

    return (
        <div css={styles.root} className={cx('ui-SortDropdown', className)}>
            <Dropdown
                css={styles.dropdown}
                onSelect={handleSort}
                options={options.map(option => ({
                    label: typeof option === 'string' ? t(`sortby.options${allowDirection ? 'Sortable' : ''}.${option}`) : option.label,
                    value: typeof option === 'string' ? option : option.value,
                }))}
                value={state.value}
                {...outerProps}
            />
            {allowDirection && (
                <Button css={styles.button} onClick={handleOrder} ml={2} variant='link'>
                    <span className={`ui-SortDropdown__${state.direction}`}>
                        <Icon svg={state.direction === 'desc' ? <SortDescIcon /> : <SortAscIcon />} size='lg' />
                    </span>
                </Button>
            )}
        </div>
    );
};

SortDropdown.propTypes = {
    ...PROP_TYPES_DROPDOWN,
    onSort: PropTypes.func.isRequired,
    allowDirection: PropTypes.bool,
};

SortDropdown.defaultProps = {
    allowDirection: false,
    direction: 'asc',
    value: '',
};

export default SortDropdown;
