/* eslint-disable no-underscore-dangle */
import axios from 'axios';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import PropTypes from 'prop-types';
import React, { useState, useEffect } from 'react';
import { Row, Col, Tab, Tabs } from 'react-bootstrap';
import './SavedPreferences.scss';
import { Caption, Button, H6, H5, Box, P, Input } from 'hdruk-react-core';

const baseURL = require('../BaseURL').getURL();

const SavedPreferences = ({ onHide, viewSaved, activeTab, saveName, saveSuccess, search, filters, sort, tab }) => {
    const [data, setData] = useState([]);
    const [dataLink, setDataLink] = useState(data);
    const [activeCard, setActiveCard] = useState('');
    const [showButtons, setShowButtons] = useState(false);

    useEffect(() => {
        axios.get(`${baseURL}/api/v1/search-preferences`).then(res => {
            setData(res.data.data);
        });
    }, []);

    const resetTabs = () => {
        setActiveCard('');
        setShowButtons(false);
    };

    const selectPreference = savedData => {
        setShowButtons(true);
        setDataLink(savedData);
        setActiveCard(savedData._id);
    };

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

    const getTabTitle = tabName => {
        const title = `${tabName} ${
            (tabName === 'Datasets' && `(${datasetsTotal})`) ||
            (tabName === 'Tools' && `(${toolsTotal})`) ||
            (tabName === 'Datauses' && `(${datausesTotal})`) ||
            (tabName === 'Collections' && `(${collectionsTotal})`) ||
            (tabName === 'Courses' && `(${coursesTotal})`) ||
            (tabName === 'Papers' && `(${papersTotal})`) ||
            (tabName === 'People' && `(${peopleTotal})`)
        }`;
        return <Caption>{title}</Caption>;
    };

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
            name: Yup.string().required('Please provide a title for your search'),
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
        <>
            <Row className='filters saved-preferences'>
                <Col lg={2} />
                <Col lg={8}>
                    <Box pt={4} pb={4}>
                        <H5 mb={2}>Save</H5>
                        <P mb={2}>Are you sure you want to save this search preference? If yes, please provide a title for this search.</P>
                        <Box display='flex' mb={6}>
                            <Box flexGrow='1' mr={2}>
                                <Input
                                    label='Title'
                                    data-test-id='saved-preference-name'
                                    id='name'
                                    name='name'
                                    type='text'
                                    onChange={formik.handleChange}
                                    value={formik.values.name}
                                    onBlur={formik.handleBlur}
                                    error={formik.errors.name}
                                />
                            </Box>
                            <Box mt={8}>
                                <Button onClick={formik.handleSubmit}>Save</Button>
                            </Box>
                        </Box>
                        <H6 mb={2} weight='bold'>
                            Your search preferences
                        </H6>
                        <P>
                            {`View saved preferences across all resources on the Gateway. To create a new preference, apply your desired filters on the
                resources search results page and select 'save'.`}
                        </P>
                    </Box>
                </Col>
            </Row>
            <Row className='filters saved-preferences-row'>
                <Col lg={2} />
                <Col lg={8} mt={2}>
                    <Tabs onSelect={() => resetTabs()} defaultActiveKey={activeTab} className='saved-preferences-tab'>
                        {tabs.map(tabName => (
                            <Tab eventKey={tabName} key={tabName} title={getTabTitle(tabName)}>
                                {data.filter(tabNames => tabNames.filterCriteria.tab === tabName.replace(/ /g, '')).length > 0 ? (
                                    data
                                        .filter(tabNames => tabNames.filterCriteria.tab === tabName.replace(/ /g, ''))
                                        .map(savedData => (
                                            <Box
                                                mb={4}
                                                key={savedData._id}
                                                tabIndex={0}
                                                onKeyDown={() => {
                                                    selectPreference(savedData);
                                                }}
                                                role='button'
                                                className={
                                                    activeCard === savedData._id
                                                        ? 'filters saved-card-selected saved-card-click'
                                                        : 'filters saved-card saved-card-click'
                                                }
                                                onClick={() => {
                                                    selectPreference(savedData);
                                                }}>
                                                <H5>{savedData.name}</H5>
                                                <P>
                                                    Search term:{' '}
                                                    {savedData.filterCriteria && savedData.filterCriteria.searchTerm === '' ? (
                                                        'N/A'
                                                    ) : (
                                                        <P>{`"${savedData.filterCriteria.searchTerm}"`}</P>
                                                    )}
                                                </P>
                                                <P>
                                                    Filters applied: {savedData.filterCriteria.filters.length > 0 ? '' : 'N/A'}
                                                    <br />
                                                    {savedData.filterCriteria.filters.map(savedDataFilter => (
                                                        <div className='filters-chip saved-filter-chip'>{savedDataFilter.label}</div>
                                                    ))}
                                                </P>
                                            </Box>
                                        ))
                                ) : (
                                    <Box mt={14} mb={14} display='flex' justifyContent='center'>
                                        <P color='grey600'>No preferences have been saved for {tabName}</P>
                                    </Box>
                                )}
                            </Tab>
                        ))}
                    </Tabs>
                </Col>
            </Row>
            <Row className='filters'>
                <Col lg={10}>
                    {showButtons && (
                        <Box flexGrow='1' display='flex' justifyContent='flex-end' mt={4} mb={4}>
                            <Button mr={2} variant='secondary' onClick={() => deleteSavedSearch()}>
                                Delete
                            </Button>
                            <Button className='view-button' onClick={() => viewSavedSearch()}>
                                View matches
                            </Button>
                        </Box>
                    )}
                </Col>
            </Row>
        </>
    );
};

SavedPreferences.propTypes = {
    onHide: PropTypes.func.isRequired,
    viewSaved: PropTypes.func.isRequired,
    saveSuccess: PropTypes.func.isRequired,
    saveName: PropTypes.func.isRequired,
    activeTab: PropTypes.string.isRequired,
    search: PropTypes.string.isRequired,
    filters: PropTypes.arrayOf(
        PropTypes.shape({
            encodedValue: PropTypes.string,
            id: PropTypes.string,
            label: PropTypes.string,
            parentKey: PropTypes.string,
            value: PropTypes.string,
        })
    ).isRequired,
    tab: PropTypes.string.isRequired,
    sort: PropTypes.string.isRequired,
};

export default SavedPreferences;
