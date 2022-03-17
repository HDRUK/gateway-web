import React from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';

const SearchResultsInfo = ({ searchTerm, count }) => {
    const { t } = useTranslation();
    return <>{searchTerm ? t('searchResultsInfo.withTerm', { count, searchTerm }) : t('searchResultsInfo.withOutTerm', { count })}</>;
};

SearchResultsInfo.propTypes = {
    searchTerm: PropTypes.string,
    count: PropTypes.number.isRequired,
};

export default SearchResultsInfo;
