import React from 'react';
import { Pagination, Row } from 'react-bootstrap';
import Loading from '../Loading';
import NoResults from '../NoResults';
import RelatedObject from '../relatedObject/RelatedObject';
import { DEFAULT_PROPS_SEARCH_RESULTS, PROP_TYPES_SEARCH_RESULTS } from './SearchResults.propTypes';

const SearchResults = ({
    results,
    type,
    count,
    search,
    data,
    sort,
    pageNumber,
    onPagination,
    maxResults,
    updateOnFilterBadge,
    isLoading,
    totalPages,
    errorMessage,
}) => (
    <>
        <div>
            {!isLoading && (
                <>
                    {sort && (
                        <Row>
                            <div className='text-right save-dropdown'>{sort}</div>
                        </Row>
                    )}
                    {count <= 0 && (!errorMessage ? <NoResults type={type} searchString={search} /> : errorMessage({ search, type }))}
                    {!results &&
                        count > 0 &&
                        data.map(item => {
                            return (
                                <RelatedObject
                                    key={item.id}
                                    data={item}
                                    activeLink={true}
                                    onSearchPage={true}
                                    updateOnFilterBadge={updateOnFilterBadge}
                                />
                            );
                        })}
                    {results && count > 0 && results(data)}
                    {count > maxResults && (
                        <Pagination>
                            {new Array(Math.ceil(totalPages)).fill().map((value, i) => (
                                <Pagination.Item key={i} active={i === pageNumber} onClick={() => onPagination(type, i * maxResults)}>
                                    {i + 1}
                                </Pagination.Item>
                            ))}
                        </Pagination>
                    )}
                </>
            )}
            {!!isLoading && <Loading data-testid='loader' />}
        </div>
    </>
);

SearchResults.propTypes = PROP_TYPES_SEARCH_RESULTS;

SearchResults.defaultProps = DEFAULT_PROPS_SEARCH_RESULTS;

export default SearchResults;
