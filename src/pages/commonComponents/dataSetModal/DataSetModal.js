import _ from 'lodash';
import React, { useEffect, useState } from 'react';
import { Modal } from 'react-bootstrap';
import ReactMarkdown from 'react-markdown';
import { ReactComponent as CloseButtonSvg } from '../../../images/close-alt.svg';
import contentService from '../../../services/content';
import DataSetHelper from '../../../utils/DataSetHelper.util';
import './DataSetModal.scss';

const DataSetModal = ({ open, closed, context, userState, is5Safes, showLoginModal }) => {
    let datasets = [];
    let title = '';
    let subTitle = '';
    let contactPoint = '';
    let dataRequestModalContent = { header: '', body: '' };
    let showActionButtons;

    const { loggedIn: isLoggedIn } = userState;
    const [screenData, setScreenData] = useState({});
    const [non5SafesData, setNon5SafesData] = useState('');

    const showNon5SafesData = () =>
        !_.isEmpty(non5SafesData) && typeof non5SafesData !== 'undefined' ? (
            <div dangerouslySetInnerHTML={{ __html: non5SafesData }} />
        ) : (
            ''
        );

    const initScreenData = () => {
        if (typeof context !== 'undefined' && !_.isEmpty(context) && !_.isEmpty(context.datasets)) {
            ({ datasets, title, subTitle, contactPoint, dataRequestModalContent, showActionButtons = true } = context);
            setScreenData({ datasets, title, subTitle, contactPoint, dataRequestModalContent, showActionButtons });
        }
    };

    const onCloseModal = action => {
        // 1. if user is not loggedIn and wants to make enquiry make them sign in
        if (!isLoggedIn && action !== 'CLOSE') {
            // 2. close modal and do not show enquiry - false;
            closed(false);
            // 3. Show the loginPanel
            DataSetHelper.showLoginPanel(window, _.isEmpty(title) ? screenData.subTitle : title);
        } else {
            // 4. do normal operation
            closed(action);
        }
    };

    useEffect(() => {
        if (open) initScreenData();

        const getNon5SafesModalContent = async () => {
            const content = await contentService.getNon5SafesModalContentRequest({ withCredentials: false });
            setNon5SafesData(content.data);
        };

        getNon5SafesModalContent();
    }, [open, context]);

    return (
        <>
            <Modal show={open} onHide={closed} size='lg' aria-labelledby='contained-modal-title-vcenter' centered>
                <div className={is5Safes ? 'appModal-header' : 'appModal-non-5safes-header'}>
                    <div className={is5Safes ? 'appModal-header--wrap' : 'appModal-non-5safes-header--wrap'}>
                        <div className='appModal-head'>
                            <h1 className='black-20-semibold'>Data access requests</h1>
                            <CloseButtonSvg className='appModal-head--close' onClick={() => onCloseModal('CLOSE')} />
                        </div>
                        {!_.isEmpty(screenData.dataRequestModalContent) &&
                        typeof screenData.dataRequestModalContent.header !== 'undefined' ? (
                            <ReactMarkdown source={screenData.dataRequestModalContent.header} />
                        ) : (
                            ''
                        )}
                    </div>
                </div>

                <div className={is5Safes ? 'appModal-body' : 'appModal-non-5safes-body'}>
                    {!_.isEmpty(screenData.dataRequestModalContent) && typeof screenData.dataRequestModalContent.body !== 'undefined' ? (
                        <ReactMarkdown source={screenData.dataRequestModalContent.body} />
                    ) : (
                        showNon5SafesData()
                    )}
                </div>

                <div className='appModal-footer'>
                    {screenData.showActionButtons ? (
                        <div className='appModal-footer--wrap' data-testid='actionButtons'>
                            {is5Safes ? (
                                <button
                                    className='button-secondary mr-2'
                                    onClick={() => {
                                        isLoggedIn ? onCloseModal('SUBMIT_APPLICATION') : showLoginModal();
                                    }}>
                                    Start application
                                </button>
                            ) : null}
                            <button
                                data-test-id='dar-modal-make-enquiry-btn'
                                className='btn btn-primary addButton'
                                onClick={() => {
                                    isLoggedIn ? onCloseModal('ENQUIRY') : showLoginModal();
                                }}>
                                Make an enquiry
                            </button>
                        </div>
                    ) : null}
                </div>
            </Modal>
        </>
    );
};

DataSetModal.defaultProps = {
    closed: () => {},
    context: {},
    userState: {},
    open: false,
};

export default DataSetModal;
