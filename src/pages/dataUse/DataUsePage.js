import { isEmpty } from 'lodash';
import React, { useEffect, useState } from 'react';
import { Button, Col, Row, Tab, Tabs } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { NotificationManager } from 'react-notifications';
import Alert from '../../components/Alert';
import { LayoutContent } from '../../components/Layout';
import dataUseRegistersService from '../../services/data-use-registers';
import googleAnalytics from '../../tracking';
import DarHelperUtil from '../../utils/DarHelper.util';
import Loading from '../commonComponents/Loading';
import MessageNotFound from '../commonComponents/MessageNotFound';
import ArchiveModal from './ArchiveModal';
import './DataUse.scss';
import Pagination from './DataUsePagination';
import Table from './DataUseTable';
import DataUseApproveModal from './modals/DataUseApproveModal';
import DataUseRejectModal from './modals/DataUseRejectModal';

const DataUsePage = ({ onClickDataUseUpload, team }) => {
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
        const init = async () => {
            try {
                const {
                    data: { data },
                } = await dataUseRegistersByTeam.mutateAsync(team);

                data.sort((a, b) => Date.parse(a.lastActivity) - Date.parse(b.lastActivity));

                setRow(data);
            } catch (e) {
                setRow([]);
            }

            setIsLoading(false);
        };

        init();
    }, [team, alert]);

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
            if (oldStatus === DarHelperUtil.dataUseRegisterStatus.INREVIEW && newStatus === DarHelperUtil.dataUseRegisterStatus.ACTIVE) {
                showAlert('Your data use has been successfully approved.');
                toggleApproveModal();
            } else if (
                oldStatus === DarHelperUtil.dataUseRegisterStatus.ARCHIVED &&
                newStatus === DarHelperUtil.dataUseRegisterStatus.ACTIVE
            ) {
                showAlert('Your data use has been successfully unarchived.');
                toggleUnarchiveModal();
            } else if (newStatus === DarHelperUtil.dataUseRegisterStatus.REJECTED) {
                showAlert('Your data use has been successfully rejected.');
                toggleRejectModal();
            } else if (newStatus === DarHelperUtil.dataUseRegisterStatus.ARCHIVED) {
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
                                    {team === 'user' ? t('datause.upload.pageInfoUser') : t('datause.upload.pageInfoTeam')}
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
                                hidden={team === 'user' ? 'hidden' : ''}>
                                + Upload
                            </Button>
                        </Col>
                    </Row>
                </div>

                <Row className=''>
                    <Col sm={12} lg={12}>
                        <Tabs
                            defaultActiveKey={
                                activeTab || (team === 'user' || (team !== 'user' && team !== 'admin') ? 'Active' : 'Pending approval')
                            }
                            className='gray700-13 data-use-tabs'>
                            {tabs.map(tabName => (
                                <Tab
                                    eventKey={tabName}
                                    title={
                                        ((team === 'user' || (team !== 'user' && team !== 'admin')) &&
                                            tabName === 'Active' &&
                                            `${tabName} (${active.length})`) ||
                                        ((team === 'admin' || (team !== 'user' && team !== 'admin')) &&
                                            tabName === 'Pending approval' &&
                                            `${tabName} (${pending.length})`) ||
                                        (team !== 'user' &&
                                            team !== 'admin' &&
                                            tabName === 'Rejected' &&
                                            `${tabName} (${rejected.length})`) ||
                                        (team !== 'user' && team !== 'admin' && tabName === 'Archived' && `${tabName} (${archived.length})`)
                                    }>
                                    {(team === 'user' || (team !== 'user' && team !== 'admin')) && tabName === 'Active' && (
                                        <Table data={currentActive} active team={team} onClickArchive={onClickArchive} />
                                    )}
                                    {(team === 'admin' || (team !== 'user' && team !== 'admin')) && tabName === 'Pending approval' && (
                                        <Table
                                            team={team}
                                            data={currentPending}
                                            pending
                                            onClickApprove={onClickApprove}
                                            onClickReject={onClickReject}
                                        />
                                    )}
                                    {team !== 'user' && team !== 'admin' && tabName === 'Rejected' && (
                                        <Table team={team} data={currentRejected} />
                                    )}
                                    {team !== 'user' && team !== 'admin' && tabName === 'Archived' && (
                                        <Table team={team} data={currentArchived} archived onClickUnarchive={onClickUnarchive} />
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
