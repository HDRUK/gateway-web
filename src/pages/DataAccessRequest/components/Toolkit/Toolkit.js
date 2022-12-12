import { useState } from 'react';
import { Button } from 'hdruk-react-core';
import { Modal } from 'react-bootstrap';
import '../DataAccessRequest.scss';

function Toolkit() {
    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    return (
        <>
            <Button variant='secondary' className='techDetailButton' onClick={handleShow}>
                View the toolkit
            </Button>
            <Modal show={show} onHide={handleClose} size='lg' aria-labelledby='contained-modal-title-vcenter' centered className='darModal'>
                <iframe src='https://hda-toolkit.org/story_html5.html' className='darIframe'>
                    {' '}
                </iframe>
            </Modal>
        </>
    );
}

export default Toolkit;
