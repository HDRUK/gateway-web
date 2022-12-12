import React from 'react';
import { Pagination } from 'react-bootstrap';

export const PaginationHelper = props => {
    const { paginationIndex = 0, setPaginationIndex, doEntitiesCall, statusKey, entityCount, maxResults } = props;

    const handlePagination = (key, index) => {
        setPaginationIndex(index);
        doEntitiesCall(key, false, index);
    };

    const previousPageButton = (index, maxResults, key) => {
        return (
            <Pagination.Prev
                onClick={e => {
                    handlePagination(key, index - maxResults);
                }}
                disabled={index < maxResults}
            >
                Previous
            </Pagination.Prev>
        );
    };

    const nextPageButton = (count, index, maxResults, key) => {
        return (
            <Pagination.Next
                onClick={e => {
                    handlePagination(key, index + maxResults);
                }}
                disabled={count - (index + maxResults) <= 0}
            >
                Next
            </Pagination.Next>
        );
    };

    const getPaginationItems = (count, key) => {
        let paginationItems = [];

        paginationItems.push(previousPageButton(paginationIndex, maxResults, key));
        for (let i = 1; i <= Math.ceil(count / maxResults); i++) {
            paginationItems.push(
                <Pagination.Item
                    data-testid={`${statusKey}PaginationItem`}
                    key={i}
                    active={i === paginationIndex / maxResults + 1}
                    onClick={e => {
                        handlePagination(key, (i - 1) * maxResults);
                    }}
                >
                    {i}
                </Pagination.Item>
            );
        }
        paginationItems.push(nextPageButton(count, paginationIndex, maxResults, key));

        return paginationItems;
    };

    return (
        <Pagination className='margin-top-16' data-testid={`${statusKey}Pagination`}>
            {getPaginationItems(entityCount, statusKey)}
        </Pagination>
    );
};
