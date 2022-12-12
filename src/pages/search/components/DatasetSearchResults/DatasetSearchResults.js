import _ from 'lodash';
import React from 'react';
import { omit } from '../../../../configs/propTypes';
import RelatedObject from '../../../commonComponents/relatedObject/RelatedObject';
import SearchResults from '../../../commonComponents/SearchResults';
import { PROP_TYPES_SEARCH_RESULTS } from '../../../commonComponents/SearchResults/SearchResults.propTypes';

const DatasetSearchResults = ({ updateOnFilterBadge, ...outerProps }) => {
    const mapResults = React.useCallback(
        data => {
            return data.map(dataset => {
                let datasetPublisher;
                let datasetLogo;

                !_.isEmpty(dataset.datasetv2) && _.has(dataset, 'datasetv2.summary.publisher.name')
                    ? (datasetPublisher = dataset.datasetv2.summary.publisher.name)
                    : (datasetPublisher = '');

                !_.isEmpty(dataset.datasetv2) && _.has(dataset, 'datasetv2.summary.publisher.logo')
                    ? (datasetLogo = dataset.datasetv2.summary.publisher.logo)
                    : (datasetLogo = '');

                return (
                    <RelatedObject
                        key={dataset.id}
                        data={dataset}
                        activeLink={true}
                        onSearchPage={true}
                        updateOnFilterBadge={updateOnFilterBadge}
                        datasetPublisher={datasetPublisher}
                        datasetLogo={datasetLogo}
                    />
                );
            });
        },
        [updateOnFilterBadge]
    );

    return <SearchResults type='dataset' results={mapResults} {...outerProps} />;
};

DatasetSearchResults.propTypes = omit(PROP_TYPES_SEARCH_RESULTS, ['type', 'results']);

export default DatasetSearchResults;
