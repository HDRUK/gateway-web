import React, { useState, useEffect } from 'react';
import axios from 'axios';
import moment from 'moment';
import { Row, Col, Button, Tabs, Tab, DropdownButton, Dropdown } from 'react-bootstrap';
import MessageNotFound from '../commonComponents/MessageNotFound';
import Loading from '../commonComponents/Loading';
import './Dashboard.scss';
import { EntityActionButton } from './EntityActionButton.jsx';
import googleAnalytics from '../../tracking';
import { PaginationHelper } from '../commonComponents/PaginationHelper';
import { LayoutContent } from '../../components/Layout';

var baseURL = require('../commonComponents/BaseURL').getURL();

const AccountCollections = props => {
    const [key, setKey] = useState('active');
    const [collectionsList, setCollectionsList] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [activeCount, setActiveCount] = useState(0);
    const [archiveCount, setArchiveCount] = useState(0);
    const [activeIndex, setActiveIndex] = useState(0);
    const [archiveIndex, setArchiveIndex] = useState(0);
    const [isResultsLoading, setIsResultsLoading] = useState(true);
    const maxResults = 40;

    useEffect(() => {
        doCollectionsCall('active', true, 0, true);
    }, []);

    const handleSelect = key => {
        setKey(key);

        let index;
        if (key === 'active') {
            index = activeIndex;
        } else if (key === 'archive') {
            index = archiveIndex;
        }

        doCollectionsCall(key, false, index);
    };

    const doCollectionsCall = (key, updateCounts, index, firstLoad) => {
        if (firstLoad === true) {
            setIsLoading(true);
        }
        setIsResultsLoading(true);

        let apiUrl;
        if (typeof index === 'undefined') {
            apiUrl = baseURL + `/api/v1/collections/getList?status=${key}`;
        } else {
            apiUrl = baseURL + `/api/v1/collections/getList?status=${key}&offset=${index}&limit=${maxResults}`;
        }

        axios.get(apiUrl).then(res => {
            setCollectionsList(res.data.data[0]);

            if (updateCounts === true) {
                setActiveCount(res.data.data[1].activeCount);
                setArchiveCount(res.data.data[1].archiveCount);
            }
            if (firstLoad === true) {
                setIsLoading(false);
            }
            setIsResultsLoading(false);
        });
        window.scrollTo(0, 0);
    };

    const unarchiveCollection = id => {
        axios
            .put(baseURL + '/api/v1/collections/status/' + id, {
                activeflag: 'active',
            })
            .then(res => {
                if (shouldChangeTab()) {
                    setKey('active');
                    doCollectionsCall('active', true, activeIndex);
                } else if (archiveCount - (archiveIndex + maxResults) <= 0 && archiveCount % maxResults === 1 && archiveCount !== 1) {
                    setArchiveIndex(archiveIndex - maxResults);
                    doCollectionsCall(key, true, archiveIndex - maxResults);
                } else {
                    doCollectionsCall('archive', true, archiveIndex);
                }
            });
    };

    const deleteCollection = id => {
        axios.delete(baseURL + '/api/v1/collections/delete/' + id).then(res => {
            if (shouldChangeTab()) {
                setKey('active');
                doCollectionsCall('active', true, activeIndex);
            } else if (
                key === 'active' &&
                !shouldChangeTab() &&
                activeCount - (activeIndex + maxResults) <= 0 &&
                activeCount % maxResults === 1
            ) {
                setActiveIndex(activeIndex - maxResults);
                doCollectionsCall('active', true, activeIndex - maxResults);
            } else if (
                key === 'archive' &&
                !shouldChangeTab() &&
                archiveCount - (archiveIndex + maxResults) <= 0 &&
                archiveCount % maxResults === 1
            ) {
                setArchiveIndex(archiveIndex - maxResults);
                doCollectionsCall('archive', true, archiveIndex - maxResults);
            } else if (!shouldChangeTab()) {
                if (key === 'active') {
                    doCollectionsCall('active', true, activeIndex);
                } else if (key === 'archive') {
                    doCollectionsCall('archive', true, archiveIndex);
                }
            }
        });
    };

    const archiveCollection = id => {
        axios
            .put(baseURL + '/api/v1/collections/status/' + id, {
                activeflag: 'archive',
            })
            .then(res => {
                setKey('active');
                if (activeCount - (activeIndex + maxResults) <= 0 && activeCount % maxResults === 1 && activeCount !== 1) {
                    setActiveIndex(activeIndex - maxResults);
                    doCollectionsCall(key, true, activeIndex - maxResults);
                } else {
                    doCollectionsCall('active', true, activeIndex);
                }
            });
    };

    const shouldChangeTab = () => {
        return key === 'archive' && archiveCount <= 1 ? true : false;
    };

    if (isLoading) {
        return (
            <LayoutContent className='mt-4'>
                <Loading data-testid='isLoading' />
            </LayoutContent>
        );
    }

    return (
        <div>
            <LayoutContent>
                <Row className='accountHeader'>
                    <Col sm={12} md={8}>
                        <Row>
                            <span className='black-20'>Collections</span>
                        </Row>
                        <Row>
                            <span className='gray700-13 '>Manage your existing collections or create new ones</span>
                        </Row>
                    </Col>
                    <Col sm={12} md={4} style={{ textAlign: 'right' }}>
                        <Button
                            data-test-id='add-collection-btn'
                            variant='primary'
                            href='/collection/add'
                            className='addButton'
                            onClick={() =>
                                googleAnalytics.recordEvent('Collections', 'Add a new collection', 'Collections dashboard button clicked')
                            }
                        >
                            + Create a collection
                        </Button>
                    </Col>
                </Row>

                <Row className='tabsBackground'>
                    <Col sm={12} lg={12}>
                        <Tabs data-testid='collectionTabs' className='dataAccessTabs gray700-13' activeKey={key} onSelect={handleSelect}>
                            <Tab eventKey='active' title={'Active (' + activeCount + ')'}>
                                {' '}
                            </Tab>
                            <Tab eventKey='archive' title={'Archive (' + archiveCount + ')'}>
                                {' '}
                            </Tab>
                        </Tabs>
                    </Col>
                </Row>

                {isResultsLoading && (
                    <Row className='width-100'>
                        <Col xs={12} className='noPadding'>
                            <Loading />
                        </Col>
                    </Row>
                )}

                {!isResultsLoading &&
                    (() => {
                        switch (key) {
                            case 'active':
                                return (
                                    <div>
                                        {activeCount <= 0 ? (
                                            ''
                                        ) : (
                                            <Row className='subHeader mt-3 gray800-14-bold'>
                                                <Col xs={2}>Last activity</Col>
                                                <Col xs={5}>Name</Col>
                                                <Col xs={2}>Author</Col>
                                                <Col xs={3}></Col>
                                            </Row>
                                        )}

                                        {activeCount <= 0 ? (
                                            <Row className='margin-right-15' data-testid='collectionEntryMessageNotFound'>
                                                <MessageNotFound word='collections' />
                                            </Row>
                                        ) : (
                                            collectionsList.map(collection => {
                                                if (collection.activeflag !== 'active') {
                                                    return <></>;
                                                } else {
                                                    return (
                                                        <Row className='entryBox' data-testid='collectionEntryActive'>
                                                            <Col sm={12} lg={2} className='pt-2 gray800-14'>
                                                                {moment(collection.updatedAt).format('D MMMM YYYY HH:mm')}
                                                            </Col>
                                                            <Col sm={12} lg={5} className='pt-2'>
                                                                <a href={'/collection/' + collection.id} className='black-14'>
                                                                    {collection.name}
                                                                </a>
                                                            </Col>
                                                            <Col sm={12} lg={2} className='pt-2 gray800-14'>
                                                                {collection.persons <= 0
                                                                    ? 'Author not listed'
                                                                    : collection.persons.map((person, index) => {
                                                                          return (
                                                                              <span key={index}>
                                                                                  {person.firstname} {person.lastname} <br />
                                                                              </span>
                                                                          );
                                                                      })}
                                                            </Col>

                                                            <Col sm={12} lg={3} style={{ textAlign: 'right' }} className='toolsButtons'>
                                                                <DropdownButton
                                                                    variant='outline-secondary'
                                                                    alignRight
                                                                    title='Actions'
                                                                    className='floatRight'
                                                                >
                                                                    <Dropdown.Item
                                                                        href={'/collection/edit/' + collection.id}
                                                                        className='black-14'
                                                                    >
                                                                        Edit
                                                                    </Dropdown.Item>
                                                                    <EntityActionButton
                                                                        id={collection.id}
                                                                        action={archiveCollection}
                                                                        actionType='archive'
                                                                        entity='collection'
                                                                    />
                                                                    <EntityActionButton
                                                                        id={collection.id}
                                                                        action={deleteCollection}
                                                                        actionType='delete'
                                                                        entity='collection'
                                                                    />
                                                                </DropdownButton>
                                                            </Col>
                                                        </Row>
                                                    );
                                                }
                                            })
                                        )}
                                    </div>
                                );
                            case 'archive':
                                return (
                                    <div>
                                        {archiveCount <= 0 ? (
                                            ''
                                        ) : (
                                            <Row className='subHeader mt-3 gray800-14-bold'>
                                                <Col xs={2}>Last activity</Col>
                                                <Col xs={5}>Name</Col>
                                                <Col xs={2}>Author</Col>
                                                <Col xs={3}></Col>
                                            </Row>
                                        )}

                                        {archiveCount <= 0 ? (
                                            <Row className='margin-right-15'>
                                                <MessageNotFound word='collections' />
                                            </Row>
                                        ) : (
                                            collectionsList.map(collection => {
                                                if (collection.activeflag !== 'archive') {
                                                    return <></>;
                                                } else {
                                                    return (
                                                        <Row className='entryBox' data-testid='collectionEntryArchive'>
                                                            <Col sm={12} lg={2} className='pt-2 gray800-14'>
                                                                {moment(collection.updatedAt).format('D MMMM YYYY HH:mm')}
                                                            </Col>
                                                            <Col sm={12} lg={5} className='pt-2'>
                                                                <a href={'/collection/' + collection.id} className='black-14'>
                                                                    {collection.name}
                                                                </a>
                                                            </Col>
                                                            <Col sm={12} lg={2} className='pt-2 gray800-14'>
                                                                {collection.persons <= 0
                                                                    ? 'Author not listed'
                                                                    : collection.persons.map(person => {
                                                                          return (
                                                                              <span>
                                                                                  {person.firstname} {person.lastname} <br />
                                                                              </span>
                                                                          );
                                                                      })}
                                                            </Col>

                                                            <Col sm={12} lg={3} style={{ textAlign: 'right' }} className='toolsButtons'>
                                                                <DropdownButton
                                                                    variant='outline-secondary'
                                                                    alignRight
                                                                    title='Actions'
                                                                    className='floatRight'
                                                                >
                                                                    <Dropdown.Item
                                                                        href={'/collection/edit/' + collection.id}
                                                                        className='black-14'
                                                                    >
                                                                        Edit
                                                                    </Dropdown.Item>
                                                                    <EntityActionButton
                                                                        id={collection.id}
                                                                        action={unarchiveCollection}
                                                                        actionType='unarchive'
                                                                        entity='collection'
                                                                    />
                                                                    <EntityActionButton
                                                                        id={collection.id}
                                                                        action={deleteCollection}
                                                                        actionType='delete'
                                                                        entity='collection'
                                                                    />
                                                                </DropdownButton>
                                                            </Col>
                                                        </Row>
                                                    );
                                                }
                                            })
                                        )}
                                    </div>
                                );
                            default:
                                return key;
                        }
                    })()}

                {!isResultsLoading && (
                    <div className='text-center entityDashboardPagination'>
                        {key === 'active' && activeCount > maxResults ? (
                            <PaginationHelper
                                doEntitiesCall={doCollectionsCall}
                                entityCount={activeCount}
                                statusKey={key}
                                paginationIndex={activeIndex}
                                setPaginationIndex={setActiveIndex}
                                maxResults={maxResults}
                            ></PaginationHelper>
                        ) : (
                            ''
                        )}
                        {key === 'archive' && archiveCount > maxResults ? (
                            <PaginationHelper
                                doEntitiesCall={doCollectionsCall}
                                entityCount={archiveCount}
                                statusKey={key}
                                paginationIndex={archiveIndex}
                                setPaginationIndex={setArchiveIndex}
                                maxResults={maxResults}
                            ></PaginationHelper>
                        ) : (
                            ''
                        )}
                    </div>
                )}
            </LayoutContent>
        </div>
    );
};

export default AccountCollections;
