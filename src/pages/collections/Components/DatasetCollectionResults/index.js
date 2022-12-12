import React from 'react';
import _ from 'lodash';
import RelatedObject from '../../../commonComponents/relatedObject/RelatedObject';

const DatasetCollectionResults = ({ searchResults, relatedObjects, userId }) => {
    const canViewResults = object =>
        Boolean(
            object.activeflag === 'active' ||
                (object.activeflag === 'archive' && object.type === 'dataset') ||
                (object.type === 'dataset' && object.activeflag === 'review' && object.authors.includes(userId))
        );

    return searchResults.map(object => {
        if (canViewResults(object)) {
            let reason = '';
            let updated = '';
            let user = '';
            let showAnswer = false;
            let datasetPublisher;
            let datasetLogo;
            if (object.type === 'dataset') {
                if (object.activeflag === 'archive') {
                    return <div className='entity-deleted gray800-14'>The dataset '{object.name}' has been deleted by the publisher</div>;
                }

                !_.isEmpty(object.datasetv2) && _.has(object, 'datasetv2.summary.publisher.name')
                    ? (datasetPublisher = object.datasetv2.summary.publisher.name)
                    : (datasetPublisher = '');

                !_.isEmpty(object.datasetv2) && _.has(object, 'datasetv2.summary.publisher.logo')
                    ? (datasetLogo = object.datasetv2.summary.publisher.logo)
                    : (datasetLogo = '');

                relatedObjects.map(dat => {
                    if (dat.objectId === object.datasetid) {
                        reason = dat.reason;
                        updated = dat.updated;
                        user = dat.user;
                        showAnswer = !_.isEmpty(reason);
                    }
                });
                return (
                    <RelatedObject
                        key={object.id}
                        data={object}
                        activeLink={true}
                        showRelationshipAnswer={showAnswer}
                        collectionReason={reason}
                        collectionUpdated={updated}
                        collectionUser={user}
                        datasetPublisher={datasetPublisher}
                        datasetLogo={datasetLogo}
                    />
                );
            }
        }
    });
};

export default DatasetCollectionResults;
