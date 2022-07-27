import React, { Fragment, useState } from 'react';
import { Button, Modal } from 'react-bootstrap';
import '../DataAccessRequestCustomiseForm.scss';

function Toolkit() {
    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    return (
        <Fragment>
            <Button variant='white' className='techDetailButton' onClick={handleShow}>
                View the toolkit
            </Button>
            <Modal show={show} onHide={handleClose} size='lg' aria-labelledby='contained-modal-title-vcenter' centered className='darModal'>
                <iframe src='https://hda-toolkit.org/story_html5.html' className='darIframe'>
                    {' '}
                </iframe>
            </Modal>
        </Fragment>
    );
}

export default Toolkit;
