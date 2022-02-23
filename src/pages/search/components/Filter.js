import _ from 'lodash';
import React, { Fragment, useEffect, useState } from 'react';
import { SlideDown } from 'react-slidedown';
import Checkbox from '../../../components/Checkbox';
import SVGIcon from '../../../images/SVGIcon';
import { FilterCount } from './FilterCount';
import { FilterSearch } from './FilterSearch';
import { FilterClearSection } from './FilterClearSection';
import FilterTree from './FilterTree';
import TreeSubHeader from './TreeSubHeader';
import { isTree } from '../SearchPage';

const CheckboxWrapper = ({ node = {}, highlighted = [], parentKey = '', onHandleInputChange }) => {
	let highlight = false;
	const onHandleChange = React.useCallback(
		e => {
			onHandleInputChange(node, parentKey, e.target.checked);
		},
		[node, parentKey]
	);

	if (!_.isEmpty(highlighted)) {
		highlight = highlighted.includes(node.label.toLowerCase());
	}

	return (
		<Checkbox
			label={<span className={!highlight && 'checkbox-text'}>{node.label}</span>}
			checked={node.checked}
			onChange={onHandleChange}
		/>
	);
};

const TreeHeader = ({ node }) => {
	let { label, closed, beta = false } = node;
	let count = 0;

	const getParentCounts = tree => {
		if (_.isEmpty(tree)) {
			return;
		}
		tree.forEach(node => {
			if (typeof node.selectedCount !== 'undefined') {
				count += node.selectedCount;
			}
			if (typeof node.filters !== 'undefined' && !_.isEmpty(node.filters)) {
				let child = getParentCounts(node.filters);
				return child;
			}
		});
		return count;
	};

	const renderCount = () => {
		let parentCount = getParentCounts(node.filters) || node.selectedCount;
		return parentCount > 0 ? (
			<div className='node-micro__count'>
				<FilterCount count={parentCount} />
			</div>
		) : (
			''
		);
	};

	return (
		<Fragment>
			<div className='node-title'>
				<span className={closed ? '' : 'selected'}>{label}</span>
				{beta ? <div className='node-beta'>BETA</div> : ''}
			</div>
			<div className='node-micro'>
				{renderCount()}
				<SVGIcon width='12px' height='12px' className={closed ? '' : 'flip180'} name='chevronbottom' fill={'#475da7'} />
			</div>
		</Fragment>
	);
};

const TreeItem = ({ node, highlighted, parentKey, hasChildren, onHandleInputChange, onHandleToggle }) => {
	const toggleFilter = e => {
		e.preventDefault();
		onHandleToggle(node);
	};

	if (!_.isEmpty(node.key)) {
		return (
			<div className={hasChildren ? 'node-item' : 'node-header'} onClick={e => toggleFilter(e)}>
				{hasChildren ? <TreeSubHeader node={node} /> : <TreeHeader node={node} />}
			</div>
		);
	}

	return <CheckboxWrapper node={node} highlighted={highlighted} parentKey={parentKey} onHandleInputChange={onHandleInputChange} />;
};

const TreeComponent = ({
	node,
	parentKey,
	hasChildren,
	onHandleInputChange,
	onHandleToggle,
	onHandleClearSection,
	children,
	selected = [],
}) => {
	const [searchValue, setSearchValue] = useState('');
	const [highlighted, setHighlight] = useState([]);

	const onSearchChange = value => {
		setSearchValue(value);
	};

	const onClearSection = () => {
		onHandleClearSection(node);
	};

	const getSubClass = () => {
		if (typeof node.filters !== 'undefined' && node.filters.length > 0) {
			const hasFilterGroups = [...node.filters].filter(i => i.hasOwnProperty('key')).length > 0;
			const rawFilterValues = [...node.filters].filter(i => i.hasOwnProperty('checked')).length > 0;
			if (hasChildren && hasFilterGroups) return 'node-parent-wrap';
			else if (!hasChildren && !hasFilterGroups && rawFilterValues) return 'node-checkbox-items';
			else if (hasChildren) return 'node-checkbox-wrap';
			else return 'node-checbox-single';
		}
	};

	// watch for when node changes and check highlighted
	useEffect(() => {
		// only run if node.highlighted changes
		if (typeof node.highlighted !== 'undefined') setHighlight(node.highlighted);

		if (node.closed) setSearchValue('');
	}, [node.closed, node.highlighted]);

	const hasControls = () => {
		if (isTree(node)) {
			return !!node.filtersv2 && !node.closed && node.filtersv2.length > 7;
		} else {
			return !!node.filters && !node.closed && node.filters.length > 7;
		}
	};

	const filterOutHttp = filters => {
		return filters.filter(filter => {
			return !/http/i.test(filter.value);
		});
	};

	return (
		<Fragment>
			<TreeItem
				node={node}
				highlighted={highlighted}
				parentKey={parentKey}
				hasChildren={hasChildren}
				onHandleInputChange={onHandleInputChange}
				onHandleToggle={onHandleToggle}
			/>
			<SlideDown closed={false} className={hasChildren ? 'node-check-group' : 'node-single-group'}>
				{hasControls() && (
					<>
						<FilterSearch onSearchChange={onSearchChange} />
						<FilterClearSection onClearSection={onClearSection} />
					</>
				)}
				<div className={getSubClass()}>
					{isTree(node.key) && !node.closed && (
						<FilterTree
							node={node}
							filters={filterOutHttp(node.filtersv2)}
							checked={selected.map(({ value }) => value)}
							onCheck={onHandleInputChange}
							highlighted={node.highlighted}
							onHandleToggle={onHandleToggle}
							searchValue={searchValue}
						/>
					)}

					{!isTree(node.key) && !children && typeof node.filters !== 'undefined' && node.filters.length > 0 && !node.closed && (
						<Filter
							selected={selected}
							data={node.filters}
							parentKey={node.key}
							highlighted={node.highlighted}
							hasChildren={true}
							searchValue={searchValue}
							onHandleInputChange={onHandleInputChange}
							onHandleToggle={onHandleToggle}
							onHandleClearSection={onHandleClearSection}
						/>
					)}
				</div>
			</SlideDown>
		</Fragment>
	);
};

const Filter = ({
	selected,
	data = [],
	parentKey = null,
	highlighted = [],
	hasChildren = false,
	searchValue = '',
	onHandleInputChange,
	onHandleToggle,
	onHandleClearSection,
}) => {
	let generateClassName = node => {
		let { key = '' } = node;
		let treeClass = 'node';
		if (hasChildren && !_.isEmpty(key)) return `${treeClass}-group`;
		else if (hasChildren) return `${treeClass}-subItem`;
		else return `${treeClass}-wrapper`;
	};

	return (
		<Fragment>
			{data &&
				data
					.filter(node => {
						if (!searchValue) return true;

						if (node.label.toUpperCase().includes(searchValue.toUpperCase())) return true;

						return false;
					})
					.map(node => {
						return (
							<div key={node.label} className={generateClassName(node)}>
								{generateClassName(node) !== 'node-subItem' ? (
									<TreeComponent
										selected={selected}
										key={node.id}
										node={node}
										parentKey={parentKey}
										highlighted={node.highlighted}
										hasChildren={hasChildren}
										onHandleInputChange={onHandleInputChange}
										onHandleToggle={onHandleToggle}
										onHandleClearSection={onHandleClearSection}
									/>
								) : (
									<CheckboxWrapper node={node} highlighted={highlighted} parentKey={parentKey} onHandleInputChange={onHandleInputChange} />
								)}
							</div>
						);
					})}
		</Fragment>
	);
};

export default Filter;
