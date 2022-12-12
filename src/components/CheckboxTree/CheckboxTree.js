/** @jsx jsx */
import { cx } from '@emotion/css';
import { jsx } from '@emotion/react';
import isEmpty from 'lodash/isEmpty';
import PropTypes from 'prop-types';
import React from 'react';
import ReactCheckboxTree from 'react-checkbox-tree';
import 'react-checkbox-tree/lib/react-checkbox-tree.css';
import { addCommonPropTypes } from '../../configs/propTypes';
import useCommonStyles from '../../hooks/useCommonStyles';
import Icon from '../Icon';
import { ReactComponent as ChevronRight } from '../../images/chevron-right.svg';
import { ReactComponent as ChevronBottom } from '../../images/chevron-bottom.svg';
import * as styles from './CheckboxTree.styles';

const CheckboxTree = ({
    className,
    mt,
    mb,
    ml,
    mr,
    width,
    minWidth,
    maxWidth,
    icons,
    nodes,
    checkboxProps: { variant: checkboxVariant },
    ...outerProps
}) => {
    const commonStyles = useCommonStyles({ mt, mb, ml, mr, width, minWidth, maxWidth });

    const formatNode = node => {
        if (isEmpty(node.children)) {
            const { children, ...rest } = node;
            return rest;
        }
        if (node.children) {
            return {
                ...node,
                children: node.children.map(childNodes => {
                    return formatNode(childNodes);
                }),
            };
        }
        return node;
    };

    const formattedNodes = React.useMemo(() => {
        return nodes.map(node => {
            return formatNode(node);
        });
    }, [nodes]);

    return (
        <div
            css={styles.root({
                variant: 'primary',
                hasLeafIcon: !!icons.leaf,
                hasParentIcon: !!icons.parentClose || !!icons.parentOpen,
                checkboxVariant,
            })}
            className={cx(className, commonStyles, 'ui-CheckboxTree')}
        >
            <ReactCheckboxTree nodes={formattedNodes} icons={icons} {...outerProps} checkModel='all' />
        </div>
    );
};

CheckboxTree.propTypes = addCommonPropTypes({
    nodes: PropTypes.array,
    icons: PropTypes.shape({
        expandClose: PropTypes.node,
        expandOpen: PropTypes.node,
        parentClose: PropTypes.node,
        parentOpen: PropTypes.node,
        leaf: PropTypes.node,
    }),
    checkboxProps: PropTypes.shape({
        variant: PropTypes.oneOf(['primary', 'secondary']).isRequired,
    }),
    onCheck: PropTypes.func,
});

CheckboxTree.defaultProps = {
    icons: {
        expandClose: <Icon svg={<ChevronRight />} size='lg' color='purple500' />,
        expandOpen: <Icon svg={<ChevronBottom />} size='lg' color='purple500' />,
        parentOpen: null,
        parentClose: null,
        leaf: null,
    },
    checkboxProps: {
        variant: 'primary',
    },
};

export default CheckboxTree;
