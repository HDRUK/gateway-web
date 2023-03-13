import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { P } from 'hdruk-react-core';

const SearchResultsInfo = ({ searchTerm, count }) => {
    const { t } = useTranslation();
    return (
        <P data-testid='searchResultsInfo' color='grey700' className='sentence-break'>
            {t('searchResultsInfo.withOutTerm', { count })}
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
};

SearchResultsInfo.defaultProps = {
    searchTerm: '',
};

export default SearchResultsInfo;
