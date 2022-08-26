/** @jsx jsx */
import { jsx } from '@emotion/react';
import React, { useState, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import PropTypes from 'prop-types';
import ReactMarkdown from 'react-markdown';
import { Button } from 'hdruk-react-core';
import leaglText from './TermsAndConditions';
import * as styles from './AcceptModal.styles';
import { ModalBody, ModalFooter, ModalHeader, Modal } from '../../../../components/Modal';
import LayoutBox from '../../../../components/LayoutBox';
import Typography from '../../../../components/Typography';

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

    React.useEffect(() => {
        if (open) {
            setAcceptStatus(true);
        }
    }, [open]);

    return (
        <Modal open={open} onClose={onClose} dismissable height='500px'>
            <ModalHeader>
                HEALTH DATA RESEARCH UK
                <Typography variant='h6' mb={0}>
                    {t('datause.widget.heading')}
                </Typography>
            </ModalHeader>
            <ModalBody>
                <div onScroll={onScroll} ref={listInnerRef} css={styles.markdown}>
                    <ReactMarkdown source={leaglText} className='react-markdown' />
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
