import axios from 'axios';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import PropTypes from 'prop-types';
import React, { useState, useEffect } from 'react';
import { Modal, Form, Button, Row, Col, Tab, Tabs } from 'react-bootstrap';
import './SavedPreferencesModal.scss';

const baseURL = require('../BaseURL').getURL();

const SavedPreferencesModal = ({ show, onHide, viewSaved, activeTab, saveName, saveSuccess, search, filters, sort, tab }) => {
    const [data, setData] = useState([]);
    const [dataLink, setDataLink] = useState(data);
    const [activeCard, setActiveCard] = useState('');
    const [showButtons, setShowButtons] = useState(false);

    useEffect(() => {
        axios.get(`${baseURL}/api/v1/search-preferences`).then(res => {
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

    const formik = useFormik({
        initialValues: {
            name: '',
            filterCriteria: {
                searchTerm: search || '',
                filters: filters || [],
                tab: tab || '',
                sort: sort || '',
            },
        },

        validationSchema: Yup.object({
            name: Yup.string().required('This cannot be empty'),
        }),

        onSubmit: values => {
            axios
                .post(`${baseURL}/api/v1/search-preferences`, values)
                .then(res => {
                    onHide();
                    saveName(res.data.response.name);
                    saveSuccess();
                })
                .catch(err => {
                    return err;
                });
        },

        handleClick() {},
    });

    return (
        <Modal show={show} onHide={onHide} className='save-modal-preferences'>
            <Modal.Header closeButton>
                <h5 className='black-20-semibold'>Save</h5>
            </Modal.Header>
            <Modal.Body style={{ 'max-height': 'calc(100vh - 150px)', 'overflow-y': 'auto', 'background-color': '#f6f7f8' }}>
                <p className='black-14'>
                    Are you sure you want to save this search preference? If yes, please provide a title for this search.
                </p>
                <label className='black-14'>Title</label>
                <Form.Control
                    data-test-id='saved-preference-name'
                    id='name'
                    name='name'
                    type='text'
                    className={formik.touched.name && formik.errors.name && 'save-modal-input'}
                    onChange={formik.handleChange}
                    value={formik.values.name}
                    onBlur={formik.handleBlur}
                />
                {formik.touched.name && formik.errors.name ? <div className='errorMessages'>{formik.errors.name}</div> : null}
                <br />
                <span className='black-10'>Your search preferences</span>
                <br />
                <p className='gray800-14'>
                    View saved preferences across all resources on the Gateway. To create a new preference, apply your desired filters on
                    the resources search results page and select 'save'.
                </p>
                <Tabs defaultActiveKey={activeTab} className='save-tabsBackground saved-preferences-tabs gray700-13'>
                    {tabs.map(tabName => (
                        <Tab
                            eventKey={tabName}
                            key={tabName}
                            title={`${tabName} ${
                                (tabName === 'Datasets' && `(${datasetsTotal})`) ||
                                (tabName === 'Tools' && `(${toolsTotal})`) ||
                                (tabName === 'Datauses' && `(${datausesTotal})`) ||
                                (tabName === 'Collections' && `(${collectionsTotal})`) ||
                                (tabName === 'Courses' && `(${coursesTotal})`) ||
                                (tabName === 'Papers' && `(${papersTotal})`) ||
                                (tabName === 'People' && `(${peopleTotal})`)
                            }`}>
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
                                            }}>
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
                        </Tab>
                    ))}
                </Tabs>
            </Modal.Body>

            <Modal.Footer className='saved-preference-modal-footer'>
                <Col>
                    <Button onClick={onHide} className='saved-preferences-cancel button-tertiary'>
                        Cancel
                    </Button>
                </Col>
                <Button type='submit' className='save-search-button' onClick={formik.handleSubmit}>
                    Save
                </Button>
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

SavedPreferencesModal.propTypes = {
    show: PropTypes.bool.isRequired,
    onHide: PropTypes.func.isRequired,
    viewSaved: PropTypes.func.isRequired,
    saveSuccess: PropTypes.func.isRequired,
    saveName: PropTypes.func.isRequired,
    activeTab: PropTypes.number.isRequired,
    search: PropTypes.string.isRequired, 
};

export default SavedPreferencesModal;
