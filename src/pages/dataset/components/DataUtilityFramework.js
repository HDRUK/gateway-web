import React, { useState } from 'react';
import { Modal, Row } from 'react-bootstrap';
import { ReactComponent as CloseButtonSvg } from '../../../images/close-alt.svg';
import DataUtilityModal from './DataUtilityModal';
import '../Dataset.scss';

const DataUtitlityFramework = props => {
    const [show, setShow] = useState(false);

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    return (
        <>
            <span className='purple-14 floatRight pointer' onClick={handleShow}>
                Understanding the data utility rating
            </span>

            <Modal size='lg' show={show} onHide={handleClose} className='dataUtilityModal'>
                <Modal.Header className='bottomBorder'>
                    <Modal.Title>
                        <Row className='dataUtilityClose'>
                            <CloseButtonSvg
                                className='modal-close pointer'
                                onClick={handleClose}
                                width='24px'
                                height='24px'
                                fill='#475DA7'
                            />
                        </Row>
                        <Row id='dataUtilityHeader'>
                            <span className='black-20-semibold pad-bottom-16'>Data utility framework</span>
                            <p className='gray-deep-14 margin-bottom-8'>
                                The Data Utility Framework scores datasets on 5 categories and 23 dimensions, and is used to refer to the
                                usefulness of a dataset for a given purpose. This table displays all classifications for all the dimensions,
                                allowing you to compare the scores and their linked definitions.
                            </p>
                            <a
                                href='https://www.hdruk.ac.uk/helping-with-health-data/ways-to-improve-data-quality/data-utility-evaluation/'
                                target='_blank'
                                rel='noopener noreferrer'
                                className='purple-14 pad-bottom-32'
                            >
                                Understanding the data utility evaluation
                            </a>
                        </Row>
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <DataUtilityModal />
                </Modal.Body>
            </Modal>
        </>
    );
};

export default DataUtitlityFramework;
