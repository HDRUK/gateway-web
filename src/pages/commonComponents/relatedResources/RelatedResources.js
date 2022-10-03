import React, { useState } from 'react';
import { Modal } from 'react-bootstrap';
import { Button } from 'hdruk-react-core';
import RelatedResourcesModal from '../relatedResourcesModal/RelatedResourceModal';
import { ReactComponent as CloseButtonSvg } from '../../../images/close-alt.svg';
import googleAnalytics from '../../../tracking';
import './RelatedResources.scss';

const RelatedResources = React.forwardRef((props, ref) => {
    React.useImperativeHandle(ref, () => ({
        showModal() {
            handleShow();
        },
    }));

    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    function addResources() {
        handleClose();
        props.doAddToRelatedObjects();
    }

    function closeModal() {
        handleClose();
        props.doClearRelatedObjects();
    }

    return (
        <div className='flexCenter'>
            <Button
                variant='secondary'
                href=''
                target='_blank'
                className='techDetailButton mr-2'
                onClick={() => {
                    handleShow();
                    googleAnalytics.recordVirtualPageView('Related resources modal');
                }}
                ref={ref}>
                + Add resource
            </Button>
            <Modal show={show} onHide={handleClose} aria-labelledby='contained-modal-title-vcenter' className='relatedResourcesModal'>
                <Modal.Header>
                    <Modal.Title>
                        <span className='black-20'>Add related resources</span>
                        <br />
                        <span className='gray800-14'>
                            Link this to other papers, data uses, datasets and tools. Resources must be added to the Gateway first.
                        </span>
                    </Modal.Title>
                    <CloseButtonSvg className='modal-close pointer' onClick={closeModal} width='24px' height='24px' fill='#475DA7' />
                </Modal.Header>
                <Modal.Body>
                    <RelatedResourcesModal
                        toolid={props.toolid}
                        datauseid={props.datauseid}
                        paperid={props.paperid}
                        searchString={props.searchString}
                        doSearchMethod={props.doSearchMethod}
                        doUpdateSearchString={props.doUpdateSearchString}
                        userState={props.userState}
                        datasetData={props.datasetData}
                        toolData={props.toolData}
                        datauseData={props.datauseData}
                        personData={props.personData}
                        paperData={props.paperData}
                        courseData={props.courseData}
                        summary={props.summary}
                        doAddToTempRelatedObjects={props.doAddToTempRelatedObjects}
                        tempRelatedObjectIds={props.tempRelatedObjectIds}
                        relatedObjects={props.relatedObjects}
                    />
                </Modal.Body>
                <Modal.Footer>
                    <div className='flex-grow'>
                        <span className='gray800-14'>{props.tempRelatedObjectIds.length} selected</span>
                    </div>
                    <div>
                        <Button
                            variant='secondary'
                            className='techDetailButton mr-2'
                            id='unselectButton'
                            onClick={props.doClearRelatedObjects}>
                            Unselect all
                        </Button>
                        <Button id='addResources' onClick={addResources}>
                            Add resources
                        </Button>
                    </div>
                </Modal.Footer>
            </Modal>
        </div>
    );
});

export default RelatedResources;
