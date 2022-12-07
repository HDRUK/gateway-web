/** @jsxImportSource @emotion/react */
import { cx } from '@emotion/css';

import PropTypes from 'prop-types';
import { Dropdown as BootstrapDropdown } from 'react-bootstrap';
import { Box } from 'hdruk-react-core';
import { ReactComponent as CheckIcon } from '../../images/check.svg';
import Icon from '../Icon';
import { PROP_TYPES_LAYOUTBOX } from '../LayoutBox/LayoutBox.propTypes';
import * as styles from './Dropdown.styles';

const Dropdown = ({
    defaultValue,
    value,
    options,
    variant,
    iconSelected,
    className,
    mt,
    mb,
    ml,
    mr,
    width,
    minWidth,
    maxWidth,
    size,
    ...outerProps
}) => {
    const currentValue = !value ? defaultValue : value;

    const parseOption = option => {
        return typeof option === 'string'
            ? {
                  value: option,
                  label: option,
              }
            : option;
    };

    const selectedOption = parseOption(
        options.find(option => {
            return parseOption(option).value === currentValue;
        })
    );

    return (
        <Box {...{ mt, mb, ml, mr, width, minWidth, maxWidth }}>
            <BootstrapDropdown className={cx('ui-Dropdown', className)} {...outerProps} css={styles.root({ variant, size })}>
                <BootstrapDropdown.Toggle variant={variant}>{selectedOption && selectedOption.label}</BootstrapDropdown.Toggle>
                <BootstrapDropdown.Menu>
                    {options.map(option => {
                        const { value: eventKey, label } = parseOption(option);

                        return (
                            <BootstrapDropdown.Item eventKey={eventKey} key={eventKey} className='d-flex'>
                                <div className='flex-grow'>{label}</div>
                                {eventKey === currentValue && iconSelected}
                            </BootstrapDropdown.Item>
                        );
                    })}
                </BootstrapDropdown.Menu>
            </BootstrapDropdown>
        </Box>
    );
};

Dropdown.propTypes = {
    variant: PropTypes.oneOf(['primary', 'secondary']),
    ...PROP_TYPES_LAYOUTBOX,
};

Dropdown.defaultProps = {
    variant: 'primary',
    options: [],
    iconSelected: <Icon svg={<CheckIcon />} fill='green600' color='green600' ml={1} size='xl' />,
    size: 'default',
};

export default Dropdown;
