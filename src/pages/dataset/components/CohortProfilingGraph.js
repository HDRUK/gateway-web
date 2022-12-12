import React, { Fragment } from 'react';
import { Col, Row } from 'react-bootstrap';
import { isEmpty } from 'lodash';
import Loading from '../../commonComponents/Loading';
import '../Dataset.scss';

const CohortProfilingGraph = ({ variableValues, handleToggleRows, showAllRows, rowsInGraph, isLoading }) => {
    const renderShowButton = () => {
        return (
            <Row>
                <Col sm={12} lg={12}>
                    <button className='button-tertiary show-all-button mt-3' type='button' onClick={() => handleToggleRows()}>
                        {showAllRows ? 'Show top 10 rows' : `Show ${rowsInGraph} rows`}
                    </button>
                </Col>
            </Row>
        );
    };

    const renderBarInGraph = value => {
        return (
            <Row className='variable-row'>
                <Col sm={3} lg={3} className='gray800-14 pad-top-8 pad-bottom-8 overflowWrap'>
                    {value.value}
                </Col>
                <Col sm={1} lg={1} className='gray800-14 pad-top-8 pad-bottom-8'>
                    {value.frequency}
                </Col>
                <Col sm={8} lg={8} className='gray800-14 pad-top-8 pad-bottom-8'>
                    <div className='frequency-bar' style={{ width: `${value.frequencyAsPercentage * 100}%` }}>
                        &nbsp;
                    </div>
                </Col>
            </Row>
        );
    };

    return (
        <Fragment>
            {isLoading ? (
                <Loading />
            ) : showAllRows ? (
                !isEmpty(variableValues) ? (
                    <Fragment>
                        {variableValues.map(value => renderBarInGraph(value))}
                        {rowsInGraph > 10 ? renderShowButton() : ''}
                    </Fragment>
                ) : (
                    ''
                )
            ) : (
                <Fragment>
                    {variableValues.slice(0, 10).map(value => renderBarInGraph(value))}
                    {rowsInGraph > 10 ? renderShowButton() : ''}
                </Fragment>
            )}
        </Fragment>
    );
};

export default CohortProfilingGraph;
