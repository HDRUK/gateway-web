import _ from 'lodash';

// NOTES:
// All these functions mutate the array that is passed in. Ideally we wouldn't mutate this data. If we moved to a
// more functional programming style then we could avoid this, but for now i've just copied the original functions
// from the CollectionPage component

export const sortByMetadataQuality = filteredData =>
    filteredData.sort((a, b) =>
        _.has(a, 'datasetfields.metadataquality.quality_score') && _.has(b, 'datasetfields.metadataquality.quality_score')
            ? b.datasetfields.metadataquality.quality_score - a.datasetfields.metadataquality.quality_score
            : ''
    );

export const sortByRecentlyAdded = filteredData => {
    return filteredData.sort((a, b) => b.updated - a.updated);
};

export const sortByResources = filteredData => {
    return filteredData.sort((a, b) => b.relatedresources - a.relatedresources);
};

export const sortByRelevance = (filteredData, searchCollectionsString) => {
    const getCountOfSearchTerm = field => {
        if (!field) {
            return 0;
        }

        if (_.isArray(field)) {
            return field.toString().toLowerCase().split(searchCollectionsString.toLowerCase()).length - 1;
        } else {
            return field.toLowerCase().split(searchCollectionsString.toLowerCase()).length - 1;
        }
    };

    filteredData.forEach(function (data) {
        if (data.type === 'course') {
            let containsSearchTermCount =
                getCountOfSearchTerm(data.title) +
                getCountOfSearchTerm(data.description) +
                getCountOfSearchTerm(data.award) +
                getCountOfSearchTerm(data.domains);
            data.searchTermInstances = containsSearchTermCount;
        } else if (data.type === 'person') {
            let containsSearchTermCount =
                getCountOfSearchTerm(data.firstname) + getCountOfSearchTerm(data.lastname) + getCountOfSearchTerm(data.bio);
            data.searchTermInstances = containsSearchTermCount;
        } else if (data.type === 'dataset') {
            let abstractOrDescriptionCount;
            if (_.has(data, 'datasetfields.abstract') && !_.isNull(data.datasetfields.abstract)) {
                abstractOrDescriptionCount = getCountOfSearchTerm(data.datasetfields.abstract);
            } else {
                abstractOrDescriptionCount = getCountOfSearchTerm(data.description);
            }

            let containsSearchTermCount =
                abstractOrDescriptionCount +
                getCountOfSearchTerm(data.name) +
                getCountOfSearchTerm(data.tags.topics) +
                getCountOfSearchTerm(data.tags.features);
            data.searchTermInstances = containsSearchTermCount;
        } else {
            //Other entities ie. Tools, Papers, Projects
            let containsSearchTermCount =
                getCountOfSearchTerm(data.name) +
                getCountOfSearchTerm(data.description) +
                getCountOfSearchTerm(data.tags.topics) +
                getCountOfSearchTerm(data.tags.features) +
                (_.has(data, 'categories.category') && getCountOfSearchTerm(data.categories.category));
            data.searchTermInstances = containsSearchTermCount;
        }
    });

    return filteredData.sort((a, b) => b.searchTermInstances - a.searchTermInstances);
};

export const sortByPopularity = filteredData => {
    return filteredData.sort((a, b) => b.counter - a.counter);
};
