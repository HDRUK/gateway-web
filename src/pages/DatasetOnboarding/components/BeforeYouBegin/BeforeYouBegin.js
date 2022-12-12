import React, { Fragment } from 'react';
import { Accordion, Card } from 'react-bootstrap';
import DarHelper from '../../../../utils/DarHelper.util';

const Summary = props => {
    let { activeAccordionCard, allowedNavigation, toggleCard } = props;

    return (
        <div className='aboutAccordion'>
            <Accordion defaultActiveKey='0' activeKey={activeAccordionCard.toString()}>
                <Card className={activeAccordionCard === 0 ? 'activeCard' : ''}>
                    <Accordion.Toggle
                        as={Card.Header}
                        className={DarHelper.calcAccordionClasses(activeAccordionCard === 0, allowedNavigation)}
                        eventKey='0'
                        onClick={e => toggleCard(e, 0)}
                    >
                        <div className={`stepNumber active`}>1</div>
                        How the approval process works
                    </Accordion.Toggle>
                    <Accordion.Collapse eventKey='0'>
                        <Card.Body className='gray800-14'>
                            <div className='margin-bottom-16'>
                                <ul>
                                    <li>You can submit your dataset for review once the mandatory sections have been completed.</li>
                                    <li>It will then be pending review until an administrator has approved or rejected the dataset.</li>
                                    <li>You may view the dataset whilst it is pending but you cannot edit it.</li>
                                    <li>
                                        You can view your draft, live, pending, rejected and archived datasets in your Datasets dashboard.
                                        This can be found within your Teams account.
                                    </li>
                                </ul>
                            </div>
                            <div className='margin-bottom-16'>
                                Once approved, it will be live on the Gateway. If needed, you can create another version of the dataset to
                                make any changes. The live version will remain active on the Gateway until your new version has been
                                submitted and approved. All other previous versions of your dataset will be visible to you only.
                            </div>
                            <div className='margin-bottom-16'>
                                If rejected, you can create a new version of the dataset and submit this for review, making any changes
                                required.
                            </div>
                        </Card.Body>
                    </Accordion.Collapse>
                </Card>
                <Card className={activeAccordionCard === 1 ? 'activeCard' : ''}>
                    <Accordion.Toggle
                        as={Card.Header}
                        className={DarHelper.calcAccordionClasses(activeAccordionCard === 1, allowedNavigation)}
                        eventKey='1'
                        onClick={e => toggleCard(e, 1)}
                    >
                        <div className={`stepNumber active`}>2</div>
                        Ask HDR UK
                    </Accordion.Toggle>
                    <Accordion.Collapse eventKey='1'>
                        <Card.Body className='gray800-14'>
                            <div className='margin-bottom-16'>
                                If you have any further questions regarding the metadata onboarding process, you can contact HDR UK via
                                email at support@healthdatagateway.org
                            </div>
                        </Card.Body>
                    </Accordion.Collapse>
                </Card>
                <Card className={activeAccordionCard === 2 ? 'activeCard' : ''}>
                    <Accordion.Toggle
                        as={Card.Header}
                        className={DarHelper.calcAccordionClasses(activeAccordionCard === 2, allowedNavigation)}
                        eventKey='2'
                        onClick={e => toggleCard(e, 2)}
                    >
                        <div className={`stepNumber active`}>3</div>
                        Best practice and further guidance
                    </Accordion.Toggle>
                    <Accordion.Collapse eventKey='2'>
                        <Card.Body className='gray800-14'>
                            <Fragment>
                                <div className='margin-bottom-16'>
                                    Further guidance about metadata onboarding is available at the following{' '}
                                    <a
                                        id='furtherGuidanceLink'
                                        target='_blank'
                                        rel='noopener noreferrer'
                                        href='https://metadata.atlassian.net/wiki/spaces/HDR/overview'
                                    >
                                        link
                                    </a>
                                </div>
                                <div className='margin-bottom-16'>The following datasets have a high metadata richness score of Gold:</div>
                                <div className='margin-bottom-16'>
                                    <a
                                        id='exampleDataset1'
                                        target='_blank'
                                        rel='noopener noreferrer'
                                        href='https://web.www.healthdatagateway.org/dataset/594cfe55-96e3-45ff-874c-2c0006eeb881'
                                    >
                                        [COVID-19 Symptom tracker]
                                    </a>
                                </div>
                                <div className='margin-bottom-16'>
                                    <a
                                        id='exampleDataset2'
                                        target='_blank'
                                        rel='noopener noreferrer'
                                        href='https://web.www.healthdatagateway.org/dataset/31f0148b-f965-4136-ab39-6c5bbbf8c2d9'
                                    >
                                        [National COVID-19 Chest Imaging Database]
                                    </a>
                                </div>
                            </Fragment>
                        </Card.Body>
                    </Accordion.Collapse>
                </Card>
                <Card className={activeAccordionCard === 3 ? 'activeCard' : ''}>
                    <Accordion.Toggle
                        as={Card.Header}
                        className={DarHelper.calcAccordionClasses(activeAccordionCard === 3, allowedNavigation)}
                        eventKey='3'
                        onClick={e => toggleCard(e, 3)}
                    >
                        <div className={`stepNumber active`}>4</div>
                        Uploading multiple datasets
                    </Accordion.Toggle>
                    <Accordion.Collapse eventKey='3'>
                        <Card.Body className='gray800-14'>
                            <Fragment>
                                <div className='margin-bottom-16'>
                                    If you want to upload multiple datasets in bulk, please contact support@healthdatagateway.org.
                                </div>
                            </Fragment>
                        </Card.Body>
                    </Accordion.Collapse>
                </Card>
                <Card className={activeAccordionCard === 4 ? 'activeCard' : ''}>
                    <Accordion.Toggle
                        as={Card.Header}
                        className={DarHelper.calcAccordionClasses(activeAccordionCard === 4, allowedNavigation)}
                        eventKey='4'
                        onClick={e => toggleCard(e, 4)}
                    >
                        <div className={`stepNumber active`}>5</div>
                        Your metadata score
                    </Accordion.Toggle>
                    <Accordion.Collapse eventKey='4'>
                        <Card.Body className='gray800-14'>
                            <Fragment>
                                <div className='margin-bottom-16'>
                                    Once approved and uploaded, your dataset will receive a metadata richness score that is calculated based
                                    on the information that you provide on the form.
                                </div>
                                <div className='margin-bottom-16'>
                                    The more detail you provide, the higher your metadata richness score will be.
                                </div>
                                <div className='margin-bottom-16'>
                                    The scores include: white [not rated], bronze, silver, gold and platinum.
                                </div>
                                <div className='margin-bottom-16'>
                                    <strong>Link to more detailed guidance:</strong>
                                    <br />
                                    <a
                                        id='moreDetailMetadataScore'
                                        target='_blank'
                                        rel='noopener noreferrer'
                                        href='https://github.com/HDRUK/datasets/tree/master/reports'
                                    >
                                        https://github.com/HDRUK/datasets/tree/master/reports
                                    </a>
                                </div>
                            </Fragment>
                        </Card.Body>
                    </Accordion.Collapse>
                </Card>
            </Accordion>
        </div>
    );
};

export default Summary;
