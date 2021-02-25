import React from 'react';
import { Pagination } from 'react-bootstrap';

export const PaginationHelper = props => {
	const { paginationIndex = 0, setPaginationIndex, doEntitiesCall, statusKey, entityCount, maxResult, relatedResources = false } = props;

	const handlePagination = (key, index) => {
		setPaginationIndex(index);

		if (relatedResources) {
			doEntitiesCall('click', translateKey(key), index);
		} else {
			doEntitiesCall(key, false, index);
		}
	};

	const translateKey = statusKey => {
		switch (statusKey) {
			case 'Datasets':
				return 'dataset';
			case 'Tools':
				return 'tool';
			case 'Projects':
				return 'project';
			case 'Papers':
				return 'paper';
			case 'People':
				return 'person';
			case 'Course':
				return 'course';
			default:
				return statusKey;
		}
	};

	const previousPageButton = (index, maxResult, key) => {
		return (
			<Pagination.Prev
				onClick={e => {
					handlePagination(key, index - maxResult);
				}}
				disabled={index < maxResult}>
				Previous
			</Pagination.Prev>
		);
	};

	const nextPageButton = (count, index, maxResult, key) => {
		return (
			<Pagination.Next
				onClick={e => {
					handlePagination(key, index + maxResult);
				}}
				disabled={count - (index + maxResult) <= 0}>
				Next
			</Pagination.Next>
		);
	};

	const getPaginationItems = (count, key) => {
		let paginationItems = [];

		paginationItems.push(previousPageButton(paginationIndex, maxResult, key));
		for (let i = 1; i <= Math.ceil(count / maxResult); i++) {
			paginationItems.push(
				<Pagination.Item
					data-testid={`${statusKey}PaginationItem`}
					key={i}
					active={i === paginationIndex / maxResult + 1}
					onClick={e => {
						handlePagination(key, (i - 1) * maxResult);
					}}>
					{i}
				</Pagination.Item>
			);
		}
		paginationItems.push(nextPageButton(count, paginationIndex, maxResult, key));

		return paginationItems;
	};

	return (
		<Pagination className='margin-top-16' data-testid={`${statusKey}Pagination`}>
			{getPaginationItems(entityCount, statusKey)}
		</Pagination>
	);
};
