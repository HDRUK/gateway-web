import React from 'react';
import { ReactComponent as CDStar } from '../../../../images/cd-star.svg';
import googleAnalytics from '../../../../tracking';

const SearchFilters = ({ children, onAdvancedSearchClick }) => {
    const handleOnClick = React.useCallback(() => {
        googleAnalytics.recordEvent('Datasets', 'User clicked advanced search link', 'Advanced search modal opened');
        onAdvancedSearchClick();
    }, [onAdvancedSearchClick]);

    return (
        <>
            {children && <div className='saved-filterHolder'>{children}</div>}
            <div className='advanced-search-link-container'>
                <CDStar fill='#f98e2b' height='20' width='20' />
                <a href='javascript:void(0)' className='textUnderline gray800-14 cursorPointer' onClick={handleOnClick}>
                    Advanced Search
                </a>
            </div>
        </>
    );
};

export default SearchFilters;
