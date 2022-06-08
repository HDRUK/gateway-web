/** @jsx jsx */
import { cx } from '@emotion/css';
import { jsx } from '@emotion/react';
import PropTypes from 'prop-types';
import React from 'react';
import { addCommonPropTypes } from '../../configs/propTypes';
import LayoutBox from '../LayoutBox';
import CheckboxTreeNode from './CheckboxTreeNode';
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
    nodes,
    variant,
    checked,
    expanded,
    onCheck,
    onExpand,
    ...outerProps
}) => {
    const [checkedValues, setCheckedValues] = React.useState(checked);
    const [expandedValues, setExpandedValues] = React.useState(expanded);

    const handleCheck = React.useCallback(
        e => {
            let changedValues;

            if (e.target.checked) {
                changedValues = [...checkedValues, e.target.value];
            } else {
                changedValues = checkedValues.filter(value => e.target.value !== value);
            }

            setCheckedValues(changedValues);

            onCheck(e, changedValues);
        },
        [checkedValues]
    );

    const handleExpand = React.useCallback(
        parentValue => {
            let changedValues;

            if (!expandedValues.includes(parentValue)) {
                changedValues = [...expandedValues, parentValue];
            } else {
                changedValues = expandedValues.filter(value => parentValue !== value);
            }

            setExpandedValues(changedValues);

            onExpand(parentValue, changedValues);
        },
        [expandedValues]
    );

    return (
        <LayoutBox
            {...{ mt, mb, ml, mr, width, minWidth, maxWidth }}
            className={cx(className, 'ui-CheckboxTree')}
            css={styles.root}
            {...outerProps}>
            <CheckboxTreeNode
                onExpand={handleExpand}
                onCheck={handleCheck}
                checked={checkedValues}
                expanded={expandedValues}
                nodes={nodes}
            />
        </LayoutBox>
    );
};

CheckboxTree.propTypes = addCommonPropTypes({
    nodes: PropTypes.array,
    variant: PropTypes.oneOf(['primary', 'secondary']).isRequired,
    onCheck: PropTypes.func,
    onExpand: PropTypes.func,
    checked: PropTypes.arrayOf(PropTypes.string),
    expanded: PropTypes.arrayOf(PropTypes.string),
});

CheckboxTree.defaultProps = {
    variant: 'primary',
    onCheck: () => {},
    onExpand: () => {},
    checked: [],
    expanded: [],
};

export default CheckboxTree;
