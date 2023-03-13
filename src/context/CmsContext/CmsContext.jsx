import { createContext, useContext, useCallback, useState, useEffect } from 'react';

import Cookies from 'js-cookie';

export const CmsContext = createContext();

export const useCms = () => {
    return useContext(CmsContext);
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

    const handleResetData = useCallback(() => {
        Cookies.remove('cmsData', { domain: window.location.hostname.replace('web.', '') });

        setData(null);
    }, []);

    const handleSetData = useCallback(value => {
        const cmsData = JSON.stringify(value);

        Cookies.set('cmsData', cmsData, { domain: window.location.hostname.replace('web.', '') });

        setData(value);
    }, []);

    return (
        <CmsContext.Provider
            value={{
                resetData: handleResetData,
                setData: handleSetData,
                data,
            }}>
            {children}
        </CmsContext.Provider>
    );
};
