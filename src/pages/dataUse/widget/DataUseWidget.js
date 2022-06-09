import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { LayoutContent } from '../../../components/Layout';
import Typography from '../../../components/Typography';
import Button from '../../../components/Button';
import Checkbox from '../../../components/Checkbox';
import useScript from '../../../hooks/useScript';
import DataUseWidgetCode from './widgetCode';
import AcceptModal from './AcceptModal';

const WIDGET_MODULE = `https://unpkg.com/hdruk-gateway-widgets?module`;
const DataUseWidget = ({ userState, team, onClickDataUseUpload, ref, publisherName, accepted }) => {
    const { t } = useTranslation();
    useScript(WIDGET_MODULE);
    const [checked, setChecked] = useState(accepted || false);
    const [state, setState] = useState({
        showAcceptModal: false,
    });
    const codeString = `<script type="module" src="${WIDGET_MODULE}"></script>\n<hdruk-data-uses publisher="${publisherName}"/>`;

    const clickHandler = () => {
        setState({ ...state, showAcceptModal: true });
    };

    const modalCloseHandler = () => {
        setState({ ...state, showAcceptModal: false });
    };

    const acceptHandler = () => {
        setState({ ...state, showAcceptModal: false });
        setChecked(true);
    };

    const copyToClipBoardHandler = () => {
        navigator.clipboard.writeText(codeString);
    };

    return (
        <LayoutContent>
            <div className='accountHeader'>
                <Typography variant='h5' data-testid='howToHeader'>
                    {t('datause.widget.howToHeader')}
                </Typography>
                <Typography mb={3}>{t('datause.widget.howToDesc')}</Typography>
                <Button mb={3} onClick={clickHandler} disabled={checked} data-testid='getWidgetButton' type='button'>
                    {t('datause.widget.getWidgetButton')}
                </Button>

                <Typography>{t('datause.widget.tAndCHelp')}</Typography>
                <Checkbox
                    variant='primary'
                    label='I agree to the HDR Widget Terms and Conditions of use'
                    id='termCo  nditions'
                    mb={4}
                    disabled={checked}
                    checked={checked}
                />
                <Typography variant='h6'>{t('datause.widget.heading')}</Typography>
                <Typography color='grey600'>
                    <i>{t('datause.widget.buttonHelp')}</i>
                </Typography>
                <hdruk-data-uses custodianName={publisherName} />
                <br />
                {checked && <DataUseWidgetCode codeString={codeString} copyToClipBoard={copyToClipBoardHandler} />}
                <AcceptModal open={state.showAcceptModal} closed={modalCloseHandler} acceptHandler={acceptHandler} />
            </div>
        </LayoutContent>
    );
};

export default DataUseWidget;
