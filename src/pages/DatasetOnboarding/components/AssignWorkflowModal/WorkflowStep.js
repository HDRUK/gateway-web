import React, { Fragment, useState } from 'react';
import { Row, Col, Button, Accordion } from 'react-bootstrap';
import SVGIcon from '../../../../images/SVGIcon';
import './AssignWorkflowModal.scss';

const WorkflowStep = ({ index, step, reviewers, displaySections }) => {
    const [flagClosed, setFlag] = useState(true);

    const updateFlag = () => {
        setFlag(!flagClosed);
    };

    return (
        <Row className='noMargin gray-top-border' style={{ width: '100%' }}>
            <Accordion defaultActiveKey='1' style={{ width: '100%' }}>
                <Accordion.Toggle
                    className='accordionToggle'
                    as={Button}
                    variant='link'
                    eventKey='0'
                    onClick={e => updateFlag()}
                    data-testid='accordion-toggle'
                >
                    <Row>
                        <Col sm={3} lg={3} className='gray800-14' style={{ float: 'left' }}>
                            <span style={{ float: 'left' }}>
                                <h3>{`${index + 1}. ${step.stepName}`}</h3>
                            </span>
                        </Col>
                        <Col sm={8} lg={8} className='gray800-14'>
                            <span style={{ float: 'left' }}>{flagClosed ? reviewers : ''}</span>
                        </Col>
                        <Col sm={1} lg={1} className='gray800-14'>
                            <SVGIcon
                                name='chevronbottom'
                                fill={'#475da7'}
                                className={flagClosed ? 'workflowChevron' : 'workflowChevron flipSVG'}
                            />
                        </Col>
                    </Row>
                </Accordion.Toggle>
                <Accordion.Collapse eventKey='0' className='pad-left-16' style={{ paddingRight: '20px' }}>
                    <Fragment>
                        <Row>
                            <Col sm={2} lg={2} className='toggleHeader'>
                                Reviewers
                            </Col>
                            <Col className='toggleContent gray800-14'>{reviewers}</Col>
                        </Row>
                        <Row>
                            <Col sm={2} lg={2} className='toggleHeader'>
                                Visible
                            </Col>
                            <Col className='toggleContent gray800-14'>{displaySections}</Col>
                        </Row>
                        <Row>
                            <Col sm={2} lg={2} className='toggleHeader pad-bottom-8'>
                                Deadline
                            </Col>
                            <Col className='toggleContent gray800-14'>{`${step.deadline} days after the start of this phase`}</Col>
                        </Row>
                    </Fragment>
                </Accordion.Collapse>
            </Accordion>
        </Row>
    );
};

export default WorkflowStep;
