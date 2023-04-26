import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { generalUtils } from 'utils';

const useQueryParam = () => {
    const location = useLocation();
    const [queryParams, setQueryParams] = useState({});

    useEffect(() => {
        const { search } = location;
        const searchParams = generalUtils.parseQueryString(search);
        setQueryParams(searchParams);
    }, [location]);

    return queryParams;
};

export default useQueryParam;
