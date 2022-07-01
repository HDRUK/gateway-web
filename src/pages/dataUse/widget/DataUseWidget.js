import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { NotificationManager } from 'react-notifications';
import { LayoutContent } from '../../../components/Layout';
import Typography from '../../../components/Typography';
import Button from '../../../components/Button';
import Checkbox from '../../../components/Checkbox';
import useScript from '../../../hooks/useScript';
import DataUseWidgetCode from './widgetCode';
import AcceptModal from './AcceptModal';
import publishersService from '../../../services/publishers';
import Card from '../../../components/Card';
import CardBody from '../../../components/Card/CardBody';

const WIDGET_MODULE = `https://unpkg.com/hdruk-gateway-widgets@0.1.0/dist/hdruk-data-uses.js`;

const DataUseWidget = ({ userState, team, onClickDataUseUpload, ref, publisherDetails }) => {
    const { t } = useTranslation();
    useScript(WIDGET_MODULE);
    const [checked, setChecked] = useState(false);
    const [disabled, setDisabled] = useState(true);
    const [state, setState] = useState({
        showAcceptModal: false,
    });

    const accepted = publisherDetails?.dataUse?.widget?.accepted;

    console.log('publisherDetails', publisherDetails);

    React.useEffect(() => {
        setChecked(accepted);
        setDisabled(!accepted);
    }, [accepted]);

    const patchPublisherDataUseRequest = publishersService.usePatchPublisherDataUseWidget({
        onError: ({ title, message }) => {
            NotificationManager.error(message, title, 10000);
        },
    });

    const codeString = `<script type="module" src="${WIDGET_MODULE}"></script>\n<hdruk-data-uses publisher="${publisherDetails.name}"/>`;

    const clickHandler = () => {
        setState({ ...state, showAcceptModal: true });
    };

    const modalCloseHandler = () => {
        setState({ ...state, showAcceptModal: false });
    };

    const acceptHandler = () => {
        setState({ ...state, showAcceptModal: false });
        setChecked(true);
        setDisabled(false);
    };

    const handleChangeTCs = ({ target: { checked } }) => {
        setChecked(checked);

        if (!checked) {
            setDisabled(true);
        }
    };

    const copyToClipBoardHandler = async () => {
        navigator.clipboard.writeText(codeString);

        await patchPublisherDataUseRequest.mutateAsync({
            _id: team,
            data: {
                accepted: true,
                acceptedByUserId: userState[0].id,
            },
        });

        setDisabled(true);
    };

    console.log('DISABLED', disabled);

    return (
        <LayoutContent>
            <Card mb={4}>
                <CardBody>
                    <Typography variant='h5'>{t('datause.widget.heading')}</Typography>
                    <Typography>{t('datause.widget.description')}</Typography>
                </CardBody>
            </Card>
            <Card>
                <CardBody>
                    <Typography variant='h5' data-testid='howToHeader'>
                        {t('datause.widget.howToHeader')}
                    </Typography>
                    <Typography mb={3}>{t('datause.widget.howToDesc')}</Typography>
                    <Button mb={3} onClick={clickHandler} disabled={checked} data-testid='getWidgetButton' type='button'>
                        {t('datause.widget.getWidgetButton')}
                    </Button>
                    <Typography>{t('datause.widget.tAndCHelp')}</Typography>
                    <Checkbox
                        label='I agree to the HDR Widget Terms and Conditions of use'
                        id='termConditions'
                        mb={7}
                        disabled={disabled}
                        checked={checked}
                        onChange={handleChangeTCs}
                    />
                    <Typography variant='h6' mb={1}>
                        {t('datause.widget.heading')}
                    </Typography>
                    <Typography color='grey600'>
                        <i>{t('datause.widget.buttonHelp')}</i>
                    </Typography>
                    <hdruk-data-uses publisher={publisherDetails.name} />
                    <br />
                    {checked && <DataUseWidgetCode codeString={codeString} copyToClipBoard={copyToClipBoardHandler} />}
                    <AcceptModal open={state.showAcceptModal} onClose={modalCloseHandler} onAccept={acceptHandler} />
                </CardBody>
            </Card>
        </LayoutContent>
    );
};

export default DataUseWidget;
