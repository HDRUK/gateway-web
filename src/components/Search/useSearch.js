import pickBy from 'lodash/pickBy';
import React from 'react';
import usePersistState from '../../hooks/usePersistState';

const useSearch = (mutateHook, options) => {
    const [params, setParams] = React.useState(
        options.initialParams || {
            limit: 10,
            page: 1,
        }
    );

    const [cache, updateCache] = usePersistState();

    const [state, setState] = React.useState({
        total: 0,
        isFetched: false,
    });

    const { isLoading, isError, data, isFetching } = mutateHook;
    const { page } = params;
    const { total } = state;

    const hasNext = React.useCallback(() => {
        const { limit, page } = params;
        return page < Math.ceil(total / limit);
    }, [params, total]);

    const hasPrevious = React.useCallback(() => {
        const { page } = params;
        return page > 1;
    }, [params]);

    const getCache = React.useCallback(
        key => {
            if (!key) return cache;

            return cache[key];
        },
        [cache]
    );

    const getResults = React.useCallback(
        async (searchParams, cacheKey) => {
            const filteredParams = pickBy(searchParams, value => value !== '');
            const queryParams = {
                limit: params.limit,
                page,
                ...filteredParams,
            };

            setParams(queryParams);
            query(queryParams, cacheKey);
        },
        [params, page]
    );

    const getCachedResults = React.useCallback(
        (searchParams, key) => {
            const existingParams = getCache(key);

            getResults(
                existingParams
                    ? existingParams.params
                    : {
                          ...options.initialParams,
                          ...searchParams,
                      },
                key
            );
        },
        [cache]
    );

    const query = React.useCallback(async (searchParams, cacheKey) => {
        try {
            const { data } = await mutateHook.mutateAsync(searchParams);
            const { total, onSuccess } = options;

            setState({
                total: (total ? total(data) : data.data.results.total) || 0,
                isFetched: true,
            });

            updateCache(cacheKey, {
                params: searchParams,
                data,
            });

            if (onSuccess) onSuccess(data, searchParams);
        } catch (e) {
            const { onError } = options;

            if (onError) onError(e, searchParams);
        }
    }, []);

    const goToPage = i => {
        const searchParams = {
            ...params,
            page: i,
            index: (i - 1) * 10,
        };

        setParams(searchParams);
        query(searchParams);
    };

    const goToNext = React.useCallback(() => {
        if (hasNext()) {
            const { page } = params;
            goToPage(page + 1);
        }
    }, [params, total]);

    const goToPrevious = React.useCallback(() => {
        if (hasPrevious()) {
            const { page } = params;
            goToPage(page - 1);
        }
    }, [params, total]);

    return {
        goToPage,
        goToNext,
        goToPrevious,
        getResults,
        getCache,
        getCachedResults,
        hasNext,
        hasPrevious,
        total,
        data,
        params,
        isLoading,
        isError,
        isFetching,
        ...state,
    };
};

export default useSearch;
