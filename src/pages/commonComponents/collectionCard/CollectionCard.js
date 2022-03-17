import React from 'react';
import { Row } from 'react-bootstrap';
import './CollectionCard.scss';

class CollectionCard extends React.Component {
    state = {
        data: [],
        entityCount: 0,
    };

    constructor(props) {
        super(props);
        this.state.data = props.data;
        this.state.entityCount = props.data.relatedObjects.length || 0;
    }

    render() {
        const { data, entityCount } = this.state;

        let people = '';
        data.persons.map((person, key) => (people = people + (key !== 0 ? ', ' : '') + person.firstname + ' ' + person.lastname));

        return (
            <div className='collectionCardHolder'>
                <div className='flexCenter'>
                    <div className='collectionCard'>
                        {!data.imageLink || data.imageLink === 'https://' ? (
                            <div className='defaultCollectionCardImage margin-right-1'>
                                <span className='badge-paper collectionBadge'>Collection</span>
                            </div>
                        ) : (
                            <div className='collectionCardImage' style={{ backgroundImage: `url(${data.imageLink})` }}>
                                <span className='badge-paper collectionBadge'>Collection</span>
                            </div>
                        )}

                        <div className='collectionCardContent'>
                            <Row className='noMargin'>
                                <span className='gray800-14'>{people.length <= 40 ? people : people.slice(0, 40) + '...'}</span>
                            </Row>

                            <Row className='noMargin pad-bottom-4'>
                                <a style={{ cursor: 'pointer' }} href={'/collection/' + data.id}>
                                    <span class='black-16'>{data.name.length <= 40 ? data.name : data.name.slice(0, 40) + '...'}</span>
                                </a>
                            </Row>
                        </div>

                        <div className='collectionEntityCount'>
                            <span className='gray700-13'>
                                {entityCount} {entityCount === 1 ? 'resource' : 'resources'}
                            </span>
                        </div>
                    </div>
                </div>
                <div class='collectionBackgroundCard'></div>
            </div>
        );
    }
}

export default CollectionCard;
