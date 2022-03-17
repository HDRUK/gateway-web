import React from 'react';
import { Col, Row } from 'react-bootstrap';
import { omit } from '../../../../configs/propTypes';
import CollectionCard from '../../../commonComponents/collectionCard/CollectionCard';
import SearchResults from '../../../commonComponents/SearchResults';
import { PROP_TYPES_SEARCH_RESULTS } from '../../../commonComponents/SearchResults/SearchResults.propTypes';

const CollectionsSearchResults = props => {
    const mapResults = React.useCallback(data => {
        return (
            <Row className='mt-2'>
                {data.map(collection => {
                    return (
                        <Col sm={12} md={12} lg={6} style={{ 'text-align': '-webkit-center' }}>
                            <CollectionCard key={collection.id} data={collection} />
                        </Col>
                    );
                })}
            </Row>
        );
    }, []);

    return <SearchResults type='collection' results={mapResults} {...props} />;
};

CollectionsSearchResults.propTypes = omit(PROP_TYPES_SEARCH_RESULTS, ['type', 'results']);

export default CollectionsSearchResults;
