import { useEffect, useState } from 'react';
import ReactDOMServer from 'react-dom/server';
import { useTranslation } from 'react-i18next';
import { NotificationManager } from 'react-notifications';
import { Card, CardBody, Button } from 'hdruk-react-core';

import { LayoutContent, Typography, Checkbox } from 'components';
import { useScript } from 'hooks';
import { publishersService } from 'services';

import AcceptModal from './AcceptModal';
import DataUseWidgetCode from './widgetCode';

const WIDGET_MODULE = `https://unpkg.com/hdruk-gateway-widgets/dist/hdruk-data-uses.js`;

const baseURL = require('../../commonComponents/BaseURL').getURL();

const DataUseWidget = ({ userState, teamId, publisherDetails }) => {
    const { t } = useTranslation();
    const widgetAPIURL = `${baseURL}/api/v1/search?search=&datausedatacustodian=${publisherDetails.name}&tab=Datauses`;
    useScript(WIDGET_MODULE);
    const [checked, setChecked] = useState(false);
    const [disabled, setDisabled] = useState(true);
    const [state, setState] = useState({
        showAcceptModal: false,
    });

    const widgetComp = <hdruk-data-uses publisher={publisherDetails.name} apiURL={widgetAPIURL} baseURL={window.location.origin} />;

    const accepted = publisherDetails?.dataUse?.widget?.accepted;

    useEffect(() => {
        if (accepted) {
            setChecked(accepted);
            setDisabled(accepted);
        }
    }, [accepted]);

    const patchPublisherDataUseRequest = publishersService.usePatchPublisherDataUseWidget({
        onError: ({ title, message }) => {
            NotificationManager.error(message, title, 10000);
        },
    });

    const codeString = `<script type="module" src="${WIDGET_MODULE}"></script>\n${ReactDOMServer.renderToString(widgetComp)}`;

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

        if (!accepted) {
            await patchPublisherDataUseRequest.mutateAsync({
                _id: teamId,
                data: {
                    accepted: true,
                    acceptedByUserId: userState[0].id,
                },
            });
        }

        setDisabled(true);
    };

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
                    {widgetComp}
                    <br />
                    {checked && <DataUseWidgetCode codeString={codeString} copyToClipBoard={copyToClipBoardHandler} />}
                    <AcceptModal open={state.showAcceptModal} onClose={modalCloseHandler} onAccept={acceptHandler} />
                </CardBody>
            </Card>
        </LayoutContent>
    );
};

export default DataUseWidget;
