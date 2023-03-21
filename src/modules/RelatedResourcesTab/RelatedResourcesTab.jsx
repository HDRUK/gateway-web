import { useState, useMemo, useEffect } from 'react';
import { Col, Dropdown, Row } from 'react-bootstrap/';
import PropTypes from 'prop-types';
import MessageNotFound from '../../pages/commonComponents/MessageNotFound';
import RelatedObject from '../../pages/commonComponents/relatedObject/RelatedObject';
import SVGIcon from '../../images/SVGIcon';
import googleAnalytics from '../../tracking';

import {
    getFilterLabel,
    getResourcesFromApi,
    filterBySearchValue,
    FILTER_SHOW_ALL,
    getResourcesBySearch,
} from './RelatedResourcesTab.utils';
import { FilterRow } from './RelatedResourcesTab.components';

const RelatedResourcesTab = ({ authorId, relatedObjects }) => {
    const [searchValue, setSearchValue] = useState('');
    const [filterType, setFilterType] = useState(FILTER_SHOW_ALL);

    const [resourcesFilteredByType, setResourcesFilteredByType] = useState([]);
    const [resourcesOnLoad, setResourcesOnLoad] = useState([]);

    const resourcesFilteredBySearch = useMemo(() => getResourcesBySearch(searchValue, resourcesOnLoad), [searchValue, resourcesOnLoad]);
    const filterTypeLabel = useMemo(() => getFilterLabel(filterType, resourcesFilteredBySearch), [filterType, resourcesFilteredBySearch]);

    const populateResources = async () => {
        const activeAndInReview = await getResourcesFromApi(relatedObjects, authorId);

        setResourcesOnLoad(activeAndInReview);
        setResourcesFilteredByType(activeAndInReview);
    };

    useEffect(() => {
        populateResources();
    }, [relatedObjects]);

    const updateSearchValue = e => {
        setSearchValue(e.target.value);
    };

    const searchOnEnter = e => {
        if (e.key !== 'Enter') return;

        setFilterType(FILTER_SHOW_ALL);
        const filteredBySearchValue = filterBySearchValue(resourcesOnLoad, searchValue);
        setResourcesFilteredByType(filteredBySearchValue);
    };

    const handleFilterByType = async selectedFilter => {
        googleAnalytics.recordEvent('Related Objects', `Filter related resources by ${selectedFilter}`, 'Filter dropdown option changed');

        const filter =
            selectedFilter === FILTER_SHOW_ALL
                ? resourcesFilteredBySearch
                : resourcesFilteredBySearch.filter(resource => resource.objectType === selectedFilter);

        setFilterType(selectedFilter);
        setResourcesFilteredByType(filter);
    };

    return (
        <>
            <Row>
                <Col lg={8}>
                    <span className='collectionsSearchBar form-control'>
                        <span className='collectionsSearchIcon'>
                            <SVGIcon name='searchicon' width={20} height={20} fill='#2c8267' stroke='none' type='submit' />
                        </span>
                        <span>
                            <input
                                id='collectionsSearchBarInput'
                                type='text'
                                placeholder='Search within related resources'
                                onChange={updateSearchValue}
                                value={searchValue}
                                onKeyDown={searchOnEnter}
                            />
                        </span>
                    </span>
                </Col>
                <Col lg={4} className='text-right'>
                    <Dropdown className='sorting-dropdown' alignRight onSelect={handleFilterByType}>
                        <Dropdown.Toggle variant='info' id='dropdown-menu-align-right' className='gray800-14'>
                            {filterTypeLabel}
                        </Dropdown.Toggle>
                        <Dropdown.Menu>
                            <FilterRow item={FILTER_SHOW_ALL} filterType={filterType} relatedObjects={resourcesFilteredBySearch} />
                            {['dataset', 'tool', 'dataUseRegister', 'paper', 'course', 'person'].map(item => {
                                return (
                                    resourcesFilteredBySearch.filter(relatedObject => relatedObject.objectType === item).length > 0 && (
                                        <FilterRow
                                            key={item}
                                            item={item}
                                            filterType={filterType}
                                            relatedObjects={resourcesFilteredBySearch}
                                        />
                                    )
                                );
                            })}
                        </Dropdown.Menu>
                    </Dropdown>
                </Col>
            </Row>
            {resourcesFilteredByType.length <= 0 ? (
                <MessageNotFound word='related resources' />
            ) : (
                resourcesFilteredByType.map(object => (
                    <span key={object.id}>
                        <RelatedObject
                            relatedObject={object}
                            objectType={object.objectType}
                            activeLink
                            shouldFetchObjectsFromApi={false}
                            showRelationshipAnswer
                            datasetPublisher={object.datasetPublisher}
                            datasetLogo={object.datasetLogo}
                        />
                    </span>
                ))
            )}
        </>
    );
};

RelatedResourcesTab.propTypes = {
    authorId: PropTypes.number.isRequired,
    relatedObjects: PropTypes.arrayOf(PropTypes.shape({ objectType: PropTypes.string, objectId: PropTypes.string })),
};

RelatedResourcesTab.defaultProps = {
    relatedObjects: [],
};

export default RelatedResourcesTab;
