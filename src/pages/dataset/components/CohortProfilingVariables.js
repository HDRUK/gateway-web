import React, { useState, useEffect } from 'react';
import { Col, Row, Collapse } from 'react-bootstrap';
import { isNil, isEmpty } from 'lodash';
import SVGIcon from '../../../images/SVGIcon';
import Loading from '../../commonComponents/Loading';
import axios from 'axios';
import { ReactComponent as VariableSvg } from '../../../images/variable.svg';
import { ReactComponent as GoldStar } from '../../../images/cd-star.svg';
import CohortProfilingGraph from './CohortProfilingGraph';
import '../Dataset.scss';
var baseURL = require('../../commonComponents/BaseURL').getURL();

const CohortProfilingVariables = props => {
    const [open, setOpen] = useState(false);
    const [flagClosed, setFlagClosed] = useState(true);
    const [cohortProfilingVariables] = useState(props.cohortProfilingVariables);
    const [cohortProfilingData, setCohortProfilingData] = useState(null);
    const [cohortProfilingVariableValues, setCohortProfilingVariableValues] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isGraphLoading, setIsGraphLoading] = useState(false);
    const [searchTerm, setSearchString] = useState('');
    const [sortType, setSortType] = useState('-frequency');
    const [showAllRowsInGraph, setShowAllRowsInGraph] = useState(false);
    const [maxLength, setMaxLength] = useState(0);
    const [numRows, setNumRows] = useState(0);
    const [totalRowsInGraph, setTotalRowsInGraph] = useState(0);
    const [currentTotalRowsInGraph, setCurrentTotalRowsInGraph] = useState();

    useEffect(() => {
        if (props.allOpen) {
            setOpen(true);
            setFlagClosed(false);
            getVariableData();
        } else {
            setOpen(false);
            setFlagClosed(true);
        }
    }, [props.allOpen]);

    const onSearch = e => {
        setSearchString(e.target.value);
    };

    const toggleRow = async () => {
        if (!open) {
            getVariableData();
        }
        setOpen(!open);
        setFlagClosed(!flagClosed);
    };

    const getVariableData = async () => {
        if (!cohortProfilingData) {
            setIsLoading(true);
            await axios
                .get(baseURL + '/api/v1/cohortProfiling/' + props.datasetID + '/' + props.tableName + '/' + cohortProfilingVariables.label)
                .then(res => {
                    setCohortProfilingData(res.data.cohortProfiling[0]);
                    setCohortProfilingVariableValues(res.data.cohortProfiling[0].values);
                    setTotalRowsInGraph(totalRowsInGraph || res.data.cohortProfiling[0].values.length);
                    setMaxLength(maxLength || res.data.cohortProfiling[0].maxLength);
                    setNumRows(numRows || res.data.cohortProfiling[0].numRows);
                    setIsLoading(false);
                })
                .catch(err => {
                    console.error(err);
                });
        }
    };

    const searchVariableData = async e => {
        if (e.key === 'Enter') {
            setIsGraphLoading(true);
            await axios
                .get(
                    baseURL +
                        '/api/v1/cohortProfiling/' +
                        props.datasetID +
                        '/' +
                        props.tableName +
                        '/' +
                        cohortProfilingVariables.label +
                        '?value=' +
                        searchTerm
                )
                .then(res => {
                    setCohortProfilingVariableValues(res.data.cohortProfiling[0].values);
                    setCurrentTotalRowsInGraph(res.data.cohortProfiling[0].values.length);
                })
                .catch(err => {
                    console.error(err);
                    setCohortProfilingVariableValues([]);
                    setCurrentTotalRowsInGraph(0);
                });
            setShowAllRowsInGraph(false);
            setIsGraphLoading(false);
        }
    };

    const sortVariableData = async paramSortType => {
        setIsGraphLoading(true);

        if (paramSortType === sortType) {
            paramSortType = '-' + paramSortType;
        }
        const searchString = searchTerm ? '&value=' + searchTerm : '';

        await axios
            .get(
                baseURL +
                    '/api/v1/cohortProfiling/' +
                    props.datasetID +
                    '/' +
                    props.tableName +
                    '/' +
                    cohortProfilingVariables.label +
                    '?sort=' +
                    paramSortType +
                    searchString
            )
            .then(res => {
                setCohortProfilingVariableValues(res.data.cohortProfiling[0].values);
                setSortType(paramSortType);
                setCurrentTotalRowsInGraph(res.data.cohortProfiling[0].values.length);
            })
            .catch(err => {
                console.error(err);
            });
        setShowAllRowsInGraph(false);
        setIsGraphLoading(false);
    };

    const handleToggleRowsInGraph = e => {
        setShowAllRowsInGraph(!showAllRowsInGraph);
    };

    if (isLoading) {
        return <Loading />;
    }
    return (
        <div className={open ? 'variableBox pad-bottom-16 pointer' : 'variableBox pad-bottom-16  heightVariable pointer'}>
            <Row className='centerVariable' onClick={() => toggleRow()}>
                <Col sm={11} lg={11} className='black-14-bold pl-3 variablePadding'>
                    <span>
                        <VariableSvg className='mr-1' style={{ float: 'left' }} />
                    </span>

                    <span className='pad-right-8' style={{ float: 'left' }}>
                        {cohortProfilingVariables ? cohortProfilingVariables.label : ''}
                    </span>

                    <span className='gray800-14-opacity' style={{ float: 'left' }}>
                        {open
                            ? ''
                            : cohortProfilingVariables &&
                              cohortProfilingVariables.description &&
                              cohortProfilingVariables.description !== null
                            ? cohortProfilingVariables.description.substr(0, 60) +
                              (cohortProfilingVariables.description.length > 60 ? '...' : '')
                            : ''}
                    </span>
                    {cohortProfilingVariables ? (
                        <span className='gray800-14-opacity centerSpan' style={{ float: 'right' }}>
                            {(cohortProfilingVariables.completeness * 100).toFixed(2)}% complete
                            <GoldStar fill={'#f98e2b'} height='20' width='20' className='ml-1' />
                        </span>
                    ) : (
                        ''
                    )}
                </Col>

                <Col sm={1} lg={1}>
                    <span>
                        <SVGIcon
                            name='chevronbottom'
                            fill={'#475da7'}
                            className={flagClosed === true ? 'svg-24 variableArrow' : 'svg-24 flipSVG variableArrow'}
                        />
                    </span>
                </Col>
            </Row>

            <Collapse in={open} className='collapseWait pad-top-8'>
                {!isEmpty(cohortProfilingData) ? (
                    <div>
                        <Row>
                            <Col sm={11} lg={11} className='gray800-14-opacity pad-top-8'>
                                {cohortProfilingVariables ? cohortProfilingVariables.description : ''}
                            </Col>
                        </Row>
                        <Row className='pad-top-16 mb-2'>
                            <Col sm={2} lg={2} className='gray800-14-opacity pad-right-24 margin-left-15'>
                                Data Type
                            </Col>
                            <Col sm={9} lg={9} className='gray800-14 pad-right-8'>
                                {cohortProfilingVariables.dataType ? cohortProfilingVariables.dataType.label : '-'}
                            </Col>
                        </Row>
                        <Row className='mb-2'>
                            <Col sm={2} lg={2} className='gray800-14-opacity pad-right-24 margin-left-15'>
                                Max length
                            </Col>
                            <Col sm={9} lg={9} className='gray800-14 pad-right-8'>
                                {maxLength ? maxLength : '-'}
                            </Col>
                        </Row>
                        <Row className='mb-2'>
                            <Col sm={2} lg={2} className='gray800-14-opacity pad-right-24 margin-left-15'>
                                Number of rows
                            </Col>
                            <Col sm={9} lg={9} className='gray800-14 pad-right-8'>
                                {numRows ? numRows : '-'}
                            </Col>
                        </Row>
                        <Row className='mb-2'>
                            <Col sm={2} lg={2} className='gray800-14-opacity pad-right-24 margin-left-15'>
                                Completeness
                            </Col>
                            <Col sm={9} lg={9} className='gray800-14 pad-right-8'>
                                {cohortProfilingData.completeness ? `${(cohortProfilingData.completeness * 100).toFixed(2)}%` : '0%'}
                            </Col>
                        </Row>
                        <Row className='sorting-buttons-container'>
                            <Col sm={3} lg={3} className='gray800-14 pad-top-8 pad-bottom-8'>
                                <button className='sort-button' type='button' onClick={() => sortVariableData('value')}>
                                    Value
                                    <span>
                                        {sortType === 'value' ? (
                                            <SVGIcon name='chevronbottom' viewBox='0 0 25 25' fill={'#475da7'} className={'svg-24'} />
                                        ) : (
                                            ''
                                        )}
                                        {sortType === '-value' ? (
                                            <SVGIcon
                                                name='chevronbottom'
                                                viewBox='0 0 25 25'
                                                fill={'#475da7'}
                                                className={'svg-24 flipSVG'}
                                            />
                                        ) : (
                                            ''
                                        )}
                                    </span>
                                </button>
                            </Col>
                            <Col sm={9} lg={9} className='gray800-14 pad-top-8 pad-bottom-8'>
                                <button className='sort-button' type='button' onClick={() => sortVariableData('frequency')}>
                                    Frequency
                                    {
                                        <span>
                                            {sortType === '-frequency' ? (
                                                <SVGIcon name='chevronbottom' viewBox='0 0 25 25' fill={'#475da7'} className={'svg-24'} />
                                            ) : (
                                                ''
                                            )}
                                            {sortType === 'frequency' ? (
                                                <SVGIcon
                                                    name='chevronbottom'
                                                    viewBox='0 0 25 25'
                                                    fill={'#475da7'}
                                                    className={'svg-24 flipSVG'}
                                                />
                                            ) : (
                                                ''
                                            )}
                                        </span>
                                    }
                                </button>
                            </Col>
                        </Row>
                        <Row>
                            <Col sm={12} lg={12} className='gray800-14 pad-top-8'>
                                <span className='variableSearchBar form-control'>
                                    <span className='variableSearchIcon'>
                                        <SVGIcon name='searchicon' width={20} height={20} fill={'#2c8267'} stroke='none' type='submit' />
                                    </span>
                                    <span>
                                        <input
                                            id='variableSearchBarInput'
                                            type='text'
                                            placeholder='Search value'
                                            onChange={event => onSearch(event)}
                                            value={searchTerm}
                                            onKeyDown={event => searchVariableData(event)}
                                        />
                                    </span>
                                </span>
                            </Col>
                        </Row>
                        <CohortProfilingGraph
                            variableValues={cohortProfilingVariableValues}
                            handleToggleRows={handleToggleRowsInGraph}
                            showAllRows={showAllRowsInGraph}
                            rowsInGraph={isNil(currentTotalRowsInGraph) ? totalRowsInGraph : currentTotalRowsInGraph}
                            isLoading={isGraphLoading}
                        ></CohortProfilingGraph>
                    </div>
                ) : (
                    <div></div>
                )}
            </Collapse>
        </div>
    );
};

export default CohortProfilingVariables;
