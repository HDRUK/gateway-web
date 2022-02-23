/** @jsx jsx */
import { cx } from '@emotion/css';
import { jsx } from '@emotion/react';
import isEmpty from 'lodash/isEmpty';
import PropTypes from 'prop-types';
import React from 'react';
import ReactCheckboxTree from 'react-checkbox-tree';
import 'react-checkbox-tree/lib/react-checkbox-tree.css';
import Icon from '../Icon';
import LayoutBox from '../LayoutBox';
import { PROP_TYPES_LAYOUTBOX } from '../LayoutBox/LayoutBox.propTypes';
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
	const formatNode = node => {
		if (isEmpty(node.children)) {
			const { children, ...rest } = node;
			return rest;
		} else if (node.children) {
			return {
				...node,
				children: node.children.map(childNodes => {
					return formatNode(childNodes);
				}),
			};
		} else {
			return node;
		}
	};

	const formattedNodes = React.useMemo(() => {
		return nodes.map(node => {
			return formatNode(node);
		});
	}, [nodes]);

	return (
		<LayoutBox {...{ mt, mb, ml, mr, width, minWidth, maxWidth }}>
			<div
				css={styles.root({
					variant: 'primary',
					hasLeafIcon: !!icons.leaf,
					hasParentIcon: !!icons.parentClose || !!icons.parentOpen,
					checkboxVariant,
				})}
				className={cx(className, 'ui-CheckboxTree')}>
				<ReactCheckboxTree nodes={formattedNodes} icons={icons} {...outerProps} />
			</div>
		</LayoutBox>
	);
};

CheckboxTree.propTypes = {
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
	...PROP_TYPES_LAYOUTBOX,
};

CheckboxTree.defaultProps = {
	icons: {
		expandClose: <Icon name='chevron-right' size='lg' color='purple500' />,
		expandOpen: <Icon name='chevron-bottom' size='lg' color='purple500' />,
		parentOpen: null,
		parentClose: null,
		leaf: null,
	},
	checkboxProps: {
		variant: 'primary',
	},
};

export default CheckboxTree;
