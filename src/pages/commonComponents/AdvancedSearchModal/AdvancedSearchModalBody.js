import React from 'react';
import { Modal, Col } from 'react-bootstrap';

const AdvancedSearchModalBody = ({
    headerText,
    isBeta,
    bodyText,
    learnMoreLink,
    loggedIn,
    doesNotRequireSignIn,
    buttonText,
    signedOutText,
    imageSrc,
    buttonClick,
    showLoginModal,
}) => {
    return (
        <Modal.Body>
            <div className='advanced-search-body'>
                <Col sm={6} className='pr-0'>
                    <div className='advanced-search-body-left'>
                        <h3 className='black-20 flex-form'>
                            {headerText} {isBeta ? <div className='beta-title ml-2'>BETA</div> : ''}
                        </h3>
                        <p className='gray800-14'>{bodyText}</p>
                        <a
                            className='textUnderline gray800-14 cursorPointer'
                            href={learnMoreLink}
                            target='_blank'
                            rel='noopener noreferrer'
                        >
                            Learn more
                        </a>
                        {loggedIn || doesNotRequireSignIn ? (
                            <button
                                type='button'
                                className='button-secondary mr-2 advanced-search-learn-more'
                                onClick={() => buttonClick()}
                            >
                                {buttonText}
                            </button>
                        ) : (
                            <a
                                className='textUnderline gray800-14 cursorPointer advanced-search-learn-more'
                                onClick={() => showLoginModal()}
                            >
                                {signedOutText}
                            </a>
                        )}
                    </div>
                </Col>
                <Col sm={6} className='pl-0'>
                    <img src={imageSrc} className='advanced-search-image' />
                </Col>
            </div>
        </Modal.Body>
    );
};

export default AdvancedSearchModalBody;
