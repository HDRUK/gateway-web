import { relatedObjectsService } from 'services';

const FILTER_SHOW_ALL = 'showAll';

const filterBySearchValue = (objects, searchValue) => {
    return objects.filter(object => {
        return ['name', 'title', 'firstname', 'lastname', 'projectTitle'].some(propName =>
            object[propName]?.toLowerCase()?.includes(searchValue.toLowerCase())
        );
    });
};

const filterOnlyActiveAndInReview = (objects, authorId) => {
    return objects.filter(object => {
        return object.activeflag === 'active' || (object.activeflag === 'review' && object.authors?.includes(authorId));
    });
};

const getResourcesFromApi = async (relatedObjects, authorId) => {
    const populatedRelatedObjects = [];

    await Promise.all(
        relatedObjects.map(async object => {
            if (['course', 'dataUseRegister'].includes(object.objectType)) {
                return relatedObjectsService.getRelatedObjectByType(object.objectId, object.objectType).then(res => {
                    populatedRelatedObjects.push({
                        ...res.data.data[0],
                        id: object.objectId,
                        objectType: object.objectType,
                    });
                });
            }
            return relatedObjectsService.getRelatedObject(object.objectId).then(res => {
                populatedRelatedObjects.push({
                    ...res.data.data[0],
                    id: object.objectId,
                    objectType: object.objectType,
                });
            });
        })
    );

    return filterOnlyActiveAndInReview(populatedRelatedObjects, authorId);
};

const getResourcesBySearch = (searchValue, relatedObjectsAll) => {
    return filterBySearchValue(relatedObjectsAll, searchValue);
};

const getFilterLabel = (filterType, relatedObjectsAll) => {
    if (filterType === FILTER_SHOW_ALL) {
        return `Show all resources (${relatedObjectsAll.length})`;
    }

    let label = `${filterType}s`;

    if (filterType === 'dataUseRegister') {
        label = 'data uses';
    }
    if (filterType === 'people') {
        label = 'people';
    }

    return `Show ${label} (${relatedObjectsAll.filter(relatedObject => relatedObject.objectType === filterType).length})`;
};

export { getResourcesBySearch, getFilterLabel, filterBySearchValue, filterOnlyActiveAndInReview, getResourcesFromApi, FILTER_SHOW_ALL };
