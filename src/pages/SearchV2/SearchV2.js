import React, { useCallback, useState, useEffect } from 'react';
import * as Sentry from '@sentry/react';
import { Box, Button, Card, CardBody, Collapsable, H5, P } from 'hdruk-react-core';
import useSearch from 'components/Search/useSearch';
import { Loading } from 'components';
import SearchFilters from '../../modules/SearchFilters/SearchFilters';
import { LayoutContent } from '../../components/Layout';
import ErrorModal from '../commonComponents/errorModal';
import searchService from '../../services/search';

export const SearchV2 = () => {
    const [expandedFilters, setExpandedFilters] = useState([]);

    const searchQuery = useSearch(searchService.useGetSearch(), {
        initialParams: {
            search: '',
            tab: 'Datasets',
        },
    });

    const searchFilterQuery = useSearch(searchService.useGetSearchFilters(), {
        initialParams: {
            search: '',
        },
    });

    const filterQuery = useSearch(searchService.useGetFilters(), {
        initialParams: {
            search: '',
        },
    });

    // const nodes = [
    //     {
    //         value: 'Barts Health',
    //         label: 'Barts Health',
    //     },
    //     {
    //         value: 'Health Data Research UK',
    //         label: 'Health Data Research UK',
    //     },
    // ];

    const handleFilterOpen = useCallback(
        key => {
            if (expandedFilters.includes(key)) {
                setExpandedFilters(expandedFilters.filter(filter => key === filter.key));
            } else {
                setExpandedFilters([...expandedFilters, key]);
            }
        },
        [expandedFilters]
    );

    const handleOnCheck = useCallback(
        (key, checked) => {
            searchQuery.getResults({
                ...searchQuery.params,
                [key]: checked.join('::'),
                tab: 'Datasets',
            });
        },
        [searchQuery.params]
    );

    const handleOnClear = useCallback(() => {
        searchQuery.getResults({}, 'Datasets');
    }, []);

    useEffect(() => {
        searchQuery.getResults({}, 'Datasets');
        searchFilterQuery.getResults({}, 'Datasets');
        filterQuery.getResults(
            {
                entityType: 'dataset',
            },
            'Datasets'
        );
    }, []);

    return (
        <Sentry.ErrorBoundary fallback={<ErrorModal />}>
            <LayoutContent>
                <Box display='flex' gap={4}>
                    <Box minWidth='250px'>
                        {filterQuery.data?.data.data.map(({ filters, label, alias }) => {
                            return (
                                <Card>
                                    <CardBody>
                                        <Collapsable
                                            toggle={<Button onClick={() => handleFilterOpen(alias)}>{label}</Button>}
                                            open={expandedFilters.includes(alias)}
                                            flexDirection='column-reverse'
                                            gap={4}
                                            maxHeight='400px'>
                                            <SearchFilters
                                                nodes={filters}
                                                onCheck={checked => handleOnCheck(alias, checked)}
                                                onClear={handleOnClear}
                                            />
                                        </Collapsable>
                                    </CardBody>
                                </Card>
                            );
                        })}
                    </Box>
                    <Box flexGrow='1'>
                        {searchQuery.isLoading && <Loading />}
                        {!searchQuery.isLoading && (
                            <div>
                                Total: {searchQuery.data?.data.summary.datasetCount}
                                {searchQuery.data?.data.datasetResults.data.map(({ name, description }) => {
                                    return (
                                        <Card mb={2}>
                                            <CardBody>
                                                <H5 mb={1}>{name}</H5>
                                                <P>{description}</P>
                                            </CardBody>
                                        </Card>
                                    );
                                })}
                            </div>
                        )}
                    </Box>
                </Box>
            </LayoutContent>
        </Sentry.ErrorBoundary>
    );
};

export default SearchV2;
