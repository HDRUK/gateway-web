import React, { useCallback, useState } from 'react';
import { useEffect } from 'react';

import Cookies from 'js-cookie';

export const CmsContext = React.createContext();

export const useCms = () => {
    return React.useContext(CmsContext);
};

export const withCms = Component => {
    return props => {
        return (
            <CmsContext.Consumer>
                {value => {
                    return <Component {...props} cmsData={value} />;
                }}
            </CmsContext.Consumer>
        );
    };
};

export const CmsProvider = ({ children }) => {
    const [data, setData] = useState();

    useEffect(() => {
        const cmsData = Cookies.get('cmsData');

        setData(cmsData ? JSON.parse(cmsData) : null);
    }, []);

    const reset = useCallback(() => {
        Cookies.remove('cmsData');

        setData(null);
    }, []);

    return (
        <CmsContext.Provider
            value={{
                reset,
                data,
            }}>
            {children}
        </CmsContext.Provider>
    );
};
