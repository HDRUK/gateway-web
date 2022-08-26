import React from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { P } from 'hdruk-react-core';

const SearchResultsInfo = ({ searchTerm, count, total }) => {
    const { t } = useTranslation();
    return (
        <P color='grey700' className='sentence-break'>
            {t('searchResultsInfo.withOutTerm', { count, total })}
            {searchTerm && (
                <>
                    {t('searchResultsInfo.for')}
                    <strong>{`'${searchTerm}'`}</strong>
                </>
            )}
        </P>
    );
};

SearchResultsInfo.propTypes = {
    searchTerm: PropTypes.string,
    count: PropTypes.number.isRequired,
    total: PropTypes.number.isRequired,
};

SearchResultsInfo.defaultProps = {
    searchTerm: '',
};

export default SearchResultsInfo;
