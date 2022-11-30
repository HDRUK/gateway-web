import pickBy from 'lodash/pickBy';
import { useState, useCallback } from 'react';
import usePersistState from '../usePersistState';

const useSearch = (mutateHook, options) => {
    const [params, setParams] = useState(
        options.initialParams || {
            limit: 10,
            page: 1,
        }
    );

    const [totalItems, setTotalItems] = useState(0);
    const [isFetched, setIsFetched] = useState(false);

    const [cache, updateCache] = usePersistState();

    const hasNext = useCallback(() => {
        return params.page < Math.ceil(totalItems / params.limit);
    }, [params, totalItems]);

    const hasPrevious = useCallback(() => {
        return params.page > 1;
    }, [params]);

    const getCache = useCallback(
        key => {
            if (!key) return cache;

            return cache[key];
        },
        [cache]
    );

    const query = useCallback(async (searchParams, cacheKey) => {
        try {
            const { data } = await mutateHook.mutateAsync(searchParams);
            const { total, onSuccess } = options;

            setTotalItems((total ? total(data) : data.data.results.total) || 0);
            setIsFetched(true);

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

    const getResults = useCallback(
        async (searchParams, cacheKey) => {
            const filteredParams = pickBy(searchParams, value => value !== '');
            const queryParams = {
                limit: params.limit,
                page: params.page,
                ...filteredParams,
            };

            setParams(queryParams);
            query(queryParams, cacheKey);
        },
        [params]
    );

    const getCachedResults = useCallback(
        (searchParams, key) => {
            const existingParams = getCache(key);

            getResults(existingParams ? existingParams.params : { ...options.initialParams, ...searchParams }, key);
        },
        [cache]
    );

    const goToPage = i => {
        const searchParams = {
            ...params,
            page: i,
            index: (i - 1) * params.limit,
        };

        setParams(searchParams);
        query(searchParams);
    };

    const goToNext = useCallback(() => {
        if (hasNext()) {
            const { page } = params;
            goToPage(page + 1);
        }
    }, [params, totalItems]);

    const goToPrevious = useCallback(() => {
        if (hasPrevious()) {
            const { page } = params;
            goToPage(page - 1);
        }
    }, [params, totalItems]);

    return {
        goToPage,
        goToNext,
        goToPrevious,
        getResults,
        getCache,
        getCachedResults,
        hasNext,
        hasPrevious,
        total: totalItems,
        isFetched,
        data: mutateHook.data,
        params,
        isLoading: mutateHook.isLoading,
        isError: mutateHook.isError,
        isFetching: mutateHook.isFetching,
    };
};

export default useSearch;
