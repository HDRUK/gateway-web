/** @jsx jsx */
import { cx } from '@emotion/css';
import { jsx } from '@emotion/react';
import isEmpty from 'lodash/isEmpty';
import PropTypes from 'prop-types';
import React from 'react';
import 'react-checkbox-tree/lib/react-checkbox-tree.css';
import { addCommonPropTypes } from '../../configs/propTypes';
import { ReactComponent as ChevronRight } from '../../images/chevron-right.svg';
import Checkbox from '../Checkbox';
import Icon from '../Icon';
import LayoutBox from '../LayoutBox';

const CheckboxTreeNode = props => {
    const { nodes, variant, checked, expanded, onCheck, onExpand } = props;

    return nodes && nodes.length ? (
        <LayoutBox className='ui-CheckboxTreeNode' as='ul' p={0}>
            {nodes.map(({ children, ...nodeProps }) => {
                return (
                    <LayoutBox as='li'>
                        <LayoutBox display='flex'>
                            {isEmpty(nodeProps.children) && (
                                <Icon svg={<ChevronRight />} size='lg' mr={1} onClick={() => onExpand(nodeProps.value)} />
                            )}
                            <Checkbox variant={variant} {...nodeProps} onChange={onCheck} checked={checked.includes(nodeProps.value)} />
                        </LayoutBox>
                        {expanded.includes(nodeProps.value) && <CheckboxTreeNode {...props} nodes={children} />}
                    </LayoutBox>
                );
            })}
        </LayoutBox>
    ) : null;
};

CheckboxTreeNode.propTypes = addCommonPropTypes({
    nodes: PropTypes.array.isRequired,
    variant: PropTypes.oneOf(['primary', 'secondary']).isRequired,
    onCheck: PropTypes.func.isRequired,
    onExpand: PropTypes.func.isRequired,
    checked: PropTypes.arrayOf(PropTypes.string).isRequired,
    expanded: PropTypes.arrayOf(PropTypes.string).isRequired,
});

export default CheckboxTreeNode;
