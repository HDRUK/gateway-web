import React from 'react';
import { Pagination } from 'react-bootstrap';
import _ from 'lodash';
import { DATASET, PERSON, RELEVANCE, POPULARITY, RECENTLYADDED, RESOURCES, METADATA } from './constants';

// TODO: Add tests for this
export const filterCollectionItems = (objectData, searchCollectionsString) => {
    return objectData.map(object => {
        // Searching functionality - searches through object data and returns true if there is a match with the search term
        if (
            !searchCollectionsString ||
            (_.has(object, 'name') ? object.name.toLowerCase().includes(searchCollectionsString.toLowerCase()) : false) ||
            (_.has(object, 'projectTitle') ? object.projectTitle.toLowerCase().includes(searchCollectionsString.toLowerCase()) : false) ||
            (_.has(object, 'title') ? object.title.toLowerCase().includes(searchCollectionsString.toLowerCase()) : false) ||
            (_.has(object, 'firstname') ? object.firstname.toLowerCase().includes(searchCollectionsString.toLowerCase()) : false) ||
            (_.has(object, 'lastname') ? object.lastname.toLowerCase().includes(searchCollectionsString.toLowerCase()) : false) ||
            (_.has(object, 'bio') ? object.bio.toLowerCase().includes(searchCollectionsString.toLowerCase()) : false) ||
            (_.has(object, 'description') && !_.isNull(object.description)
                ? object.description.toLowerCase().includes(searchCollectionsString.toLowerCase())
                : false) ||
            (_.has(object, 'datasetfields.abstract') && !_.isNull(object.datasetfields.abstract)
                ? object.datasetfields.abstract.toLowerCase().includes(searchCollectionsString.toLowerCase())
                : false) ||
            (_.has(object, 'keywords') && object.keywords && object.keywords.length > 0
                ? new RegExp(object.keywords.join('|'), 'i').test(searchCollectionsString)
                : false) ||
            (_.has(object, 'tags.features') && object.tags.features && object.tags.features.length > 0
                ? new RegExp(object.tags.features.join('|'), 'i').test(searchCollectionsString)
                : false) ||
            (_.has(object, 'tags.topics') && object.tags.topics && object.tags.topics.length > 0
                ? new RegExp(object.tags.topics.join('|'), 'i').test(searchCollectionsString)
                : false) ||
            (_.has(object, 'categories.category')
                ? object.categories.category.toLowerCase().includes(searchCollectionsString.toLowerCase())
                : false) ||
            (_.has(object, 'award') && object.award && object.award.length > 0
                ? new RegExp(object.award.join('|'), 'i').test(searchCollectionsString)
                : false) ||
            (_.has(object, 'domains') && object.domains && object.domains.length > 0
                ? new RegExp(object.domains.join('|'), 'i').test(searchCollectionsString)
                : false)
        ) {
            return object;
        } else {
            return '';
        }
    });
};

export const generatePaginatedItems = (key, count, index, paginate) => {
    const items = [];
    const maxResults = 24;

    for (let i = 1; i <= Math.ceil(count / maxResults); i++) {
        items.push(
            <Pagination.Item
                key={i}
                active={i === index + 1}
                onClick={e => {
                    paginate(key, i - 1);
                }}
            >
                {i}
            </Pagination.Item>
        );
    }

    return items;
};

export const generateDropdownItems = key => {
    if (key === DATASET) {
        return [RELEVANCE, POPULARITY, RECENTLYADDED, RESOURCES, METADATA];
    } else if (key === PERSON) {
        return [RELEVANCE, POPULARITY, RECENTLYADDED];
    } else {
        return [RELEVANCE, POPULARITY, RECENTLYADDED, RESOURCES];
    }
};
