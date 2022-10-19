/** @jsx jsx */
import { jsx } from '@emotion/react';
import PropTypes from 'prop-types';
import { Button, Icon } from 'hdruk-react-core';
import * as styles from './PopoverMenu.styles';

const PopoverMenu = ({ items }) => {
    return (
        <ul css={styles.root}>
            {items.map(({ label, icon, action, iconFill = 'purple500', buttonVariant = 'secondaryAlt', iconSize = 'lg' }, index) => {
                const ItemIcon = icon;
                return (
                    // eslint-disable-next-line react/no-array-index-key
                    <li key={index} css={styles.listItem}>
                        <Button
                            onClick={() => action()}
                            variant={buttonVariant}
                            iconLeft={icon && <Icon fill={iconFill} size={iconSize} svg={<ItemIcon />} />}>
                            {label}
                        </Button>
                    </li>
                );
            })}
        </ul>
    );
};

PopoverMenu.propTypes = {
    items: PropTypes.arrayOf(
        PropTypes.shape({
            label: PropTypes.string.isRequired,
            // eslint-disable-next-line react/forbid-prop-types
            icon: PropTypes.object,
            action: PropTypes.func.isRequired,
            iconFill: PropTypes.string,
            buttonVariant: PropTypes.string,
            iconSize: PropTypes.string,
        })
    ).isRequired,
};

export default PopoverMenu;
