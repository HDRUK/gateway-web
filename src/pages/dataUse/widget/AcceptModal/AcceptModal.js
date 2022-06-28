/** @jsx jsx */
import { jsx } from '@emotion/react';
import { useState, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import PropTypes from 'prop-types';
import ReactMarkdown from 'react-markdown';
import leaglText from './TermsAndConditions';
import * as styles from './AcceptModal.styles';
import { ModalBody, ModalFooter, ModalHeader, Modal } from '../../../../components/Modal';
import Button from '../../../../components/Button';
import LayoutBox from '../../../../components/LayoutBox';

const AcceptModal = ({ open, onClose, onAccept }) => {
    const { t } = useTranslation();
    const [disableAcceptStatus, setAcceptStatus] = useState(true);
    const listInnerRef = useRef();

    const onScroll = () => {
        if (listInnerRef.current) {
            const { scrollTop, scrollHeight, clientHeight } = listInnerRef.current;

            if (scrollTop + clientHeight >= scrollHeight - (scrollHeight / 100) * 5) {
                setAcceptStatus(false);
            } else {
                setAcceptStatus(true);
            }
        }
    };

    return (
        <Modal open={open} onClose={onClose} dismissable height='500px'>
            <ModalHeader>
                HEALTH DATA RESEARCH UK
                <h3>{t('datause.widget.heading')}</h3>
            </ModalHeader>
            <ModalBody>
                <div onScroll={onScroll} ref={listInnerRef} css={styles.markdown}>
                    <ReactMarkdown source={leaglText} />
                </div>
            </ModalBody>
            <ModalFooter>
                <LayoutBox flexGrow='1'>
                    <Button variant='tertiary' data-testid='cancel-button' onClick={onClose}>
                        {t('datause.widget.modal.cancel')}
                    </Button>
                </LayoutBox>
                <Button disabled={disableAcceptStatus} type='submit' data-testid='accept-button' onClick={onAccept}>
                    {t('datause.widget.modal.accept')}
                </Button>
            </ModalFooter>
        </Modal>
    );
};

AcceptModal.propTypes = {
    open: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    onAccept: PropTypes.func.isRequired,
};

export default AcceptModal;
