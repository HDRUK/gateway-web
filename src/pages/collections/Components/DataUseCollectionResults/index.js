import React from 'react';
import _ from 'lodash';
import RelatedObject from '../../../commonComponents/relatedObject/RelatedObject';

const DataUseCollectionResults = ({ searchResults, relatedObjects, userId }) => {
    const canViewResults = object =>
        Boolean(
            object.activeflag === 'active' ||
                (object.type === 'dataUseRegister' && object.activeflag === 'review' && object.authors.includes(userId))
        );

    return searchResults.map(object => {
        if (canViewResults) {
            let reason = '';
            let updated = '';
            let user = '';
            let showAnswer = false;
            if (object.type === 'dataUseRegister') {
                relatedObjects.map(dat => {
                    if (parseInt(dat.objectId) === object.id) {
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
                    />
                );
            }
        }
    });
};

export default DataUseCollectionResults;
