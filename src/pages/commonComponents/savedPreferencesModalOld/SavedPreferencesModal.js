import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Modal, Button, Row, Col, Tab, Tabs } from 'react-bootstrap';
import { ReactComponent as CloseButtonSvg } from '../../../images/close-alt.svg';
import './SavedPreferencesModal.scss';

var baseURL = require('../../commonComponents/BaseURL').getURL();

const SavedPreferencesModal = ({ show, onHide, viewSaved, activeTab }) => {
    const [data, setData] = useState([]);
    const [showButtons, setShowButtons] = useState(false);
    const [dataLink, setDataLink] = useState(data);
    const [activeCard, setActiveCard] = useState('');

    useEffect(() => {
        axios.get(baseURL + '/api/v1/search-preferences').then(res => {
            setData(res.data.data);
        });
    }, []);

    const viewSavedSearch = () => {
        viewSaved({
            search: dataLink.filterCriteria.searchTerm,
            filters: dataLink.filterCriteria.filters,
            sort: dataLink.filterCriteria.sort,
            tab: dataLink.filterCriteria.tab,
        });
    };

    const deleteSavedSearch = () => {
        axios.delete(`${baseURL}/api/v1/search-preferences/${activeCard}`).then(() => {
            setData(data.filter(e => e._id !== activeCard));
            setActiveCard('');
        });
    };

    const tabs = ['Datasets', 'Tools', 'Datauses', 'Collections', 'Courses', 'Papers', 'People'];

    const datasetsTotal = data.filter(a => a.name).filter(a => a.filterCriteria.tab === 'Datasets').length;
    const toolsTotal = data.filter(a => a.name).filter(a => a.filterCriteria.tab === 'Tools').length;
    const datausesTotal = data.filter(a => a.name).filter(a => a.filterCriteria.tab === 'Datauses').length;
    const collectionsTotal = data.filter(a => a.name).filter(a => a.filterCriteria.tab === 'Collections').length;
    const coursesTotal = data.filter(a => a.name).filter(a => a.filterCriteria.tab === 'Courses').length;
    const papersTotal = data.filter(a => a.name).filter(a => a.filterCriteria.tab === 'Papers').length;
    const peopleTotal = data.filter(a => a.name).filter(a => a.filterCriteria.tab === 'People').length;

    return (
        <Modal show={show} onHide={onHide} dialogClassName='save-modal-preferences'>
            <Modal.Header>
                <Modal.Title>
                    <span className='black-20'>Search preferences</span>
                    <br />
                    <p className='gray800-14'>
                        View saved preferences across all resources on the Gateway. To create a new preference, apply your desired filters
                        on the resources search results page and select 'save'.
                    </p>
                </Modal.Title>
                <CloseButtonSvg className='modal-close pointer' onClick={onHide} width='16px' height='16px' fill='#475DA7' />
            </Modal.Header>

            <Tabs defaultActiveKey={activeTab} className='save-tabsBackground saved-preferences-tabs gray700-13'>
                {tabs.map(tabName => (
                    <Tab
                        eventKey={tabName}
                        key={tabName}
                        title={
                            tabName +
                            ' ' +
                            ((tabName === 'Datasets' && '(' + datasetsTotal + ')') ||
                                (tabName === 'Tools' && '(' + toolsTotal + ')') ||
                                (tabName === 'Datauses' && '(' + datausesTotal + ')') ||
                                (tabName === 'Collections' && '(' + collectionsTotal + ')') ||
                                (tabName === 'Courses' && '(' + coursesTotal + ')') ||
                                (tabName === 'Papers' && '(' + papersTotal + ')') ||
                                (tabName === 'People' && '(' + peopleTotal + ')'))
                        }
                    >
                        <Modal.Body style={{ 'max-height': 'calc(100vh - 450px)', 'overflow-y': 'auto', 'background-color': '#f6f7f8' }}>
                            {data.filter(tabNames => tabNames.filterCriteria.tab === tabName.replace(/ /g, '')).length > 0 ? (
                                data
                                    .filter(tabNames => tabNames.filterCriteria.tab === tabName.replace(/ /g, ''))
                                    .map(savedData => (
                                        <div
                                            key={savedData._id}
                                            className={
                                                activeCard === savedData._id
                                                    ? 'filters saved-card-selected saved-card-click'
                                                    : 'filters saved-card saved-card-click'
                                            }
                                            onClick={() => {
                                                setShowButtons(true);
                                                setDataLink(savedData);
                                                setActiveCard(savedData._id);
                                            }}
                                        >
                                            <h5 className='black-20-semibold'>{savedData.name}</h5>
                                            <p className='black-14'>
                                                Search term:{' '}
                                                {savedData.filterCriteria && savedData.filterCriteria.searchTerm === '' ? (
                                                    'N/A'
                                                ) : (
                                                    <p className='black-14-bold save-searchterm'>"{savedData.filterCriteria.searchTerm}"</p>
                                                )}
                                            </p>
                                            <p>
                                                Filters applied: {savedData.filterCriteria.filters.length > 0 ? '' : 'N/A'}
                                                <br />
                                                {savedData.filterCriteria.filters.map(savedDataFilter => (
                                                    <div className='filters-chip saved-filter-chip'>{savedDataFilter.label}</div>
                                                ))}
                                            </p>
                                        </div>
                                    ))
                            ) : (
                                <Row className='mt-4'>
                                    <Col className='gray800-14 text-center'>
                                        <p>No preferences have been saved for {tabName}</p>
                                    </Col>
                                </Row>
                            )}
                        </Modal.Body>
                    </Tab>
                ))}
            </Tabs>

            <Modal.Footer className='saved-preference-modal-footer'>
                <Col>
                    <Button onClick={onHide} className='saved-preferences-cancel button-tertiary'>
                        Cancel
                    </Button>
                </Col>
                {showButtons && (
                    <Col className='text-right'>
                        <Button variant='outline-success' className='saved delete-button button-teal' onClick={() => deleteSavedSearch()}>
                            Delete
                        </Button>
                        <Button className='view-button' onClick={() => viewSavedSearch()}>
                            View matches
                        </Button>
                    </Col>
                )}
            </Modal.Footer>
        </Modal>
    );
};

export default SavedPreferencesModal;
