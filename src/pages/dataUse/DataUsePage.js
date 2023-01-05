import { isEmpty } from 'lodash';
import { useEffect, useState } from 'react';
import { Button, Col, Row, Tab, Tabs } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { NotificationManager } from 'react-notifications';

import { dataUseRegistersService } from 'services';
import { Alert, LayoutContent } from 'components';
import { darHelperUtils } from 'utils';
import { useAccountTeamSelected } from 'hooks';
import googleAnalytics from '../../tracking';

import Loading from '../commonComponents/Loading';
import MessageNotFound from '../commonComponents/MessageNotFound';
import ArchiveModal from './ArchiveModal';
import './DataUse.scss';
import Pagination from './DataUsePagination';
import Table from './DataUseTable';
import DataUseApproveModal from './modals/DataUseApproveModal';
import DataUseRejectModal from './modals/DataUseRejectModal';

const DataUsePage = ({ onClickDataUseUpload }) => {
    const { t } = useTranslation();
    const [row, setRow] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [rowsPerPage] = useState(40);
    const [alert, setAlert] = useState('');
    const [activeTab, setActiveTab] = useState('');
    const [dataUseId, setDataUseId] = useState(-1);
    const [showApproveModal, setShowApproveModal] = useState(false);
    const [showRejectModal, setShowRejectModal] = useState(false);
    const [showArchiveModal, setShowArchiveModal] = useState(false);
    const [showUnarchiveModal, setShowUnarchiveModal] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const { teamType, teamId } = useAccountTeamSelected();

    const dataUseRegistersByTeam = dataUseRegistersService.useGetDataUseRegistersByTeam(null, {
        onError: ({ title, message }) => {
            NotificationManager.error(message, title, 10000);
        },
    });

    const dataUseRegistersUpdate = dataUseRegistersService.usePatchDataUseRegister(null, {
        onError: ({ title, message }) => {
            NotificationManager.error(message, title, 10000);
        },
    });

    useEffect(() => {
        if (!teamType) return;

        const init = async () => {
            try {
                const {
                    data: { data },
                } = await dataUseRegistersByTeam.mutateAsync(teamId || teamType);

                data.sort((a, b) => Date.parse(a.lastActivity) - Date.parse(b.lastActivity));

                setRow(data);
            } catch (e) {
                setRow([]);
            }

            setIsLoading(false);
        };

        init();
    }, [teamId, teamType, alert]);

    const handleAnalytics = (label, value) => {
        googleAnalytics.recordEvent('Data uses', label, value);
    };

    const onClickArchive = dataUseId => {
        toggleArchiveModal();
        setDataUseId(dataUseId);
    };

    const onClickUnarchive = dataUseId => {
        toggleUnarchiveModal();
        setDataUseId(dataUseId);
    };

    const onClickApprove = dataUseId => {
        toggleApproveModal();
        setDataUseId(dataUseId);
    };

    const onClickReject = dataUseId => {
        toggleRejectModal();
        setDataUseId(dataUseId);
    };

    const toggleApproveModal = () => {
        setShowApproveModal(!showApproveModal);
    };

    const toggleRejectModal = () => {
        setShowRejectModal(!showRejectModal);
    };

    const toggleArchiveModal = () => {
        setShowArchiveModal(!showArchiveModal);
    };

    const toggleUnarchiveModal = () => {
        setShowUnarchiveModal(!showUnarchiveModal);
    };

    const showAlert = (message, tab) => {
        setAlert(message);
        setActiveTab(tab);
    };

    const closeAlert = () => {
        setAlert('');
    };

    const updataDataUseStatus = (oldStatus, newStatus, rejectionReason = '') => {
        dataUseRegistersUpdate.mutateAsync({ _id: dataUseId, activeflag: newStatus, rejectionReason }).then(() => {
            if (oldStatus === darHelperUtils.dataUseRegisterStatus.INREVIEW && newStatus === darHelperUtils.dataUseRegisterStatus.ACTIVE) {
                showAlert('Your data use has been successfully approved.');
                toggleApproveModal();
            } else if (
                oldStatus === darHelperUtils.dataUseRegisterStatus.ARCHIVED &&
                newStatus === darHelperUtils.dataUseRegisterStatus.ACTIVE
            ) {
                showAlert('Your data use has been successfully unarchived.');
                toggleUnarchiveModal();
            } else if (newStatus === darHelperUtils.dataUseRegisterStatus.REJECTED) {
                showAlert('Your data use has been successfully rejected.');
                toggleRejectModal();
            } else if (newStatus === darHelperUtils.dataUseRegisterStatus.ARCHIVED) {
                showAlert('Your data use has been successfully archived.');
                toggleArchiveModal();
            }
        });
    };

    const indexOfLastRow = currentPage * rowsPerPage;
    const indexOfFirstRow = indexOfLastRow - rowsPerPage;

    const tabs = ['Active', 'Pending approval', 'Rejected', 'Archived'];

    const active = row.filter(active => active.activeflag === 'active');
    const pending = row.filter(pending => pending.activeflag === 'inReview');
    const rejected = row.filter(rejected => rejected.activeflag === 'rejected');
    const archived = row.filter(archived => archived.activeflag === 'archived');

    const currentActive = active.slice(indexOfFirstRow, indexOfLastRow);
    const currentPending = pending.slice(indexOfFirstRow, indexOfLastRow);
    const currentRejected = rejected.slice(indexOfFirstRow, indexOfLastRow);
    const currentArchived = archived.slice(indexOfFirstRow, indexOfLastRow);

    const paginate = pageNumber => setCurrentPage(pageNumber);

    if (isLoading) {
        return (
            <LayoutContent>
                <Loading data-testid='isLoading' />
            </LayoutContent>
        );
    }

    return (
        <>
            <LayoutContent>
                {!isEmpty(alert) && (
                    <Alert variant='success' dismissable onClose={closeAlert} mb={1}>
                        {alert}
                    </Alert>
                )}

                <div className='accountHeader'>
                    <Row>
                        <Col sm={12} md={8}>
                            <div>
                                <span className='black-20'>Dashboard</span>
                            </div>
                            <div>
                                <span className='gray700-13 '>
                                    {teamType === 'user' ? t('datause.upload.pageInfoUser') : t('datause.upload.pageInfoTeam')}
                                </span>
                            </div>
                        </Col>
                        <Col sm={12} md={4} style={{ textAlign: 'right' }}>
                            <Button
                                variant='primary'
                                className='addButton'
                                onClick={() => {
                                    handleAnalytics('Clicked upload data use', 'Dashboard button');

                                    onClickDataUseUpload();
                                }}
                                hidden={teamType === 'user' ? 'hidden' : ''}>
                                + Upload
                            </Button>
                        </Col>
                    </Row>
                </div>

                <Row className=''>
                    <Col sm={12} lg={12}>
                        <Tabs
                            defaultActiveKey={activeTab || (teamType === 'user' || teamType === 'team' ? 'Active' : 'Pending approval')}
                            className='gray700-13 data-use-tabs'>
                            {tabs.map(tabName => (
                                <Tab
                                    key={tabName}
                                    eventKey={tabName}
                                    title={
                                        ((teamType === 'user' || teamType === 'team') &&
                                            tabName === 'Active' &&
                                            `${tabName} (${active.length})`) ||
                                        ((teamType === 'admin' || teamType === 'team') &&
                                            tabName === 'Pending approval' &&
                                            `${tabName} (${pending.length})`) ||
                                        (teamType === 'team' && tabName === 'Rejected' && `${tabName} (${rejected.length})`) ||
                                        (teamType === 'team' && tabName === 'Archived' && `${tabName} (${archived.length})`)
                                    }>
                                    {(teamType === 'user' || teamType === 'team') && tabName === 'Active' && (
                                        <Table data={currentActive} active teamType={teamType} onClickArchive={onClickArchive} />
                                    )}
                                    {(teamType === 'admin' || teamType === 'team') && tabName === 'Pending approval' && (
                                        <Table
                                            teamType={teamType}
                                            data={currentPending}
                                            pending
                                            onClickApprove={onClickApprove}
                                            onClickReject={onClickReject}
                                        />
                                    )}
                                    {teamType === 'team' && tabName === 'Rejected' && <Table teamType={teamType} data={currentRejected} />}
                                    {teamType === 'team' && tabName === 'Archived' && (
                                        <Table teamType={teamType} data={currentArchived} archived onClickUnarchive={onClickUnarchive} />
                                    )}

                                    {!row.length && !isLoading && (
                                        <MessageNotFound word='data uses' retry={dataUseRegistersByTeam.isError} />
                                    )}

                                    <Pagination
                                        rowsPerPage={rowsPerPage}
                                        totalRows={
                                            tabName === 'Active'
                                                ? active.length
                                                : tabName === 'Pending approval'
                                                ? pending.length
                                                : tabName === 'Rejected'
                                                ? rejected.length
                                                : tabName === 'Archived'
                                                ? archived.length
                                                : row.length
                                        }
                                        paginate={paginate}
                                    />
                                </Tab>
                            ))}
                        </Tabs>
                    </Col>
                </Row>
                {showArchiveModal && (
                    <ArchiveModal archive onConfirm={updataDataUseStatus} isVisible={showArchiveModal} toggleModal={toggleArchiveModal} />
                )}
                {showUnarchiveModal && (
                    <ArchiveModal
                        archive={false}
                        onConfirm={updataDataUseStatus}
                        isVisible={showUnarchiveModal}
                        toggleModal={toggleUnarchiveModal}
                    />
                )}
                {showApproveModal && (
                    <DataUseApproveModal onConfirm={updataDataUseStatus} isVisible={showApproveModal} toggleModal={toggleApproveModal} />
                )}
                {showRejectModal && (
                    <DataUseRejectModal onConfirm={updataDataUseStatus} isVisible={showRejectModal} toggleModal={toggleRejectModal} />
                )}
            </LayoutContent>
        </>
    );
};

export default DataUsePage;
