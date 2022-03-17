import React, { Component, useState } from 'react';
import axios from 'axios';
import Dropdown from 'react-bootstrap/Dropdown';
import { Row, Col, Button } from 'react-bootstrap';
import moment from 'moment';
import './AddToCollection.scss';
import SVGIcon from '../../../images/SVGIcon';

var baseURL = require('../BaseURL').getURL();

const CustomToggle = React.forwardRef(({ children, onClick }, ref) => (
    <a
        href='javascript:void(0)'
        ref={ref}
        onClick={e => {
            e.preventDefault();
            onClick(e);
        }}
    >
        {children}
    </a>
));

const CustomMenu = React.forwardRef(({ children, style, className, 'aria-labelledby': labeledBy }, ref) => {
    const [value] = useState('');

    return (
        <div ref={ref} style={style} className={className} aria-labelledby={labeledBy}>
            <ul className='list-unstyled margin-bottom-0'>
                {React.Children.toArray(children).filter(child => !value || child.props.children.toLowerCase().startsWith(value))}
            </ul>
        </div>
    );
});

class AddToCollection extends Component {
    state = {
        resourceData: [],
        collectionsData: [],
        userState: [
            {
                loggedIn: false,
                role: 'Reader',
                id: null,
                name: null,
            },
        ],
    };
    constructor(props) {
        super(props);
        this.state.userState = props.userState;
        this.state.resourceData = props.data;
    }

    componentDidMount() {
        this.doCollectionsCall();
    }

    doCollectionsCall() {
        if (this.state.userState[0].loggedIn === true) {
            axios.get(baseURL + '/api/v1/accounts/collections?id=' + this.state.userState[0].id + '').then(res => {
                this.setState({
                    collectionsData: res.data.data,
                });
            });
        }
    }

    updateCollection(dat) {
        let tempRelatedObject = {
            objectId: this.state.resourceData.type === 'dataset' ? this.state.resourceData.datasetid : this.state.resourceData.id,
            reason: '',
            pid: this.state.resourceData.pid || '',
            objectType: this.state.resourceData.type,
            user: this.state.userState[0].name,
            updated: moment().format('DD MMM YYYY'),
        };
        switch (this.state.resourceData.type) {
            case 'dataset':
                if (dat.relatedObjects.some(e => e.pid === this.state.resourceData.pid)) {
                    dat.relatedObjects = dat.relatedObjects.filter(obj => obj.pid !== this.state.resourceData.pid);
                } else {
                    dat.relatedObjects.push(tempRelatedObject);
                }
                break;
            default:
                if (dat.relatedObjects.some(e => e.objectId === this.state.resourceData.id.toString())) {
                    dat.relatedObjects = dat.relatedObjects.filter(obj => obj.objectId !== this.state.resourceData.id.toString());
                } else {
                    dat.relatedObjects.push(tempRelatedObject);
                }
                break;
        }

        let values = {
            id: dat.id,
            name: dat.name,
            description: dat.description,
            imageLink: dat.imageLink,
            authors: dat.authors,
            relatedObjects: dat.relatedObjects,
            publicflag: dat.publicflag,
        };

        axios.put(baseURL + `/api/v1/collections/edit/${dat.id}`, values).then(() => {
            this.doCollectionsCall();
        });
    }

    render() {
        const { collectionsData, userState } = this.state;
        collectionsData.sort((a, b) =>
            a.name.toUpperCase() > b.name.toUpperCase() ? 1 : b.name.toUpperCase() > a.name.toUpperCase() ? -1 : 0
        );

        if (collectionsData.length !== 0) {
            return (
                <>
                    {(() => {
                        if (userState[0].loggedIn === true) {
                            return (
                                <Dropdown>
                                    <Dropdown.Toggle as={CustomToggle}>
                                        <Button variant='medium' className='addToCollectionButton dark-14 mr-2'>
                                            Add to collection
                                        </Button>
                                    </Dropdown.Toggle>
                                    <Dropdown.Menu as={CustomMenu} className='addToCollectionDropdown'>
                                        <Row className='addToCollectionHeader'>
                                            {' '}
                                            <span className='gray800-14-bold addToCollectionItem'>Add to collection</span>{' '}
                                        </Row>
                                        {collectionsData.map(dat => {
                                            return (
                                                <div
                                                    className='gray800-14 addToCollectionItem pointer'
                                                    onClick={() => this.updateCollection(dat)}
                                                >
                                                    <Row>
                                                        <Col sm={10} lg={10}>
                                                            {dat.name}
                                                        </Col>
                                                        <Col sm={1} lg={1} style={{ 'align-self': 'center' }}>
                                                            {this.state.resourceData.type === 'dataset'
                                                                ? dat.relatedObjects.some(e => e.pid === this.state.resourceData.pid) && (
                                                                      <SVGIcon
                                                                          className='collectionCheckSvg'
                                                                          name='checkicon'
                                                                          width={16}
                                                                          height={16}
                                                                          viewbox='0 0 16 16'
                                                                          fill={'#2c8267'}
                                                                      />
                                                                  )
                                                                : dat.relatedObjects.some(
                                                                      e => e.objectId === this.state.resourceData.id.toString()
                                                                  ) && (
                                                                      <SVGIcon
                                                                          className='collectionCheckSvg'
                                                                          name='checkicon'
                                                                          width={16}
                                                                          height={16}
                                                                          viewbox='0 0 16 16'
                                                                          fill={'#2c8267'}
                                                                      />
                                                                  )}
                                                        </Col>
                                                    </Row>
                                                </div>
                                            );
                                        })}
                                    </Dropdown.Menu>
                                </Dropdown>
                            );
                        }
                    })()}
                </>
            );
        } else {
            return null;
        }
    }
}

export default AddToCollection;
