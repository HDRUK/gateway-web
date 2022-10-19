import React, { useEffect, useState, useMemo, useCallback } from 'react';
import { Card, Typography, Button, P } from 'hdruk-react-core';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import PropTypes from 'prop-types';
import { NotificationManager } from 'react-notifications';
import { Checkbox, ActionCard, Table } from 'components';
import { SUPPORT_URL } from '../../consts';
import MessageNotFound from '../../pages/commonComponents/MessageNotFound';
import Loading from '../../pages/commonComponents/Loading';
import AccountTeamMembersModal from '../AccountTeamMembersModal';
import { LayoutContent } from '../../components/Layout';
import { useAuth } from '../../context/AuthContext';
import teamsService from '../../services/teams';

const AccountTeamMembers = ({ teamId }) => {
    const { isTeamManager, managerInTeam } = useAuth();
    const [teamMembers, setTeamMembers] = useState([]);
    const [showModal, setShowModal] = useState();
    const [checkboxes, setCheckboxes] = useState({});
    const { t } = useTranslation();

    const getMembersRequest = teamsService.useGetMembers(null, {
        onError: ({ title, message }) => {
            NotificationManager.error(message, title, 10000);
        },
    });

    const columns = useMemo(
        () => [
            {
                Header: 'Name',
                accessor: 'name',
            },
            {
                Header: 'Team Admin',
                accessor: 'teamAdmin',
                cellProps: {
                    valign: 'top',
                },
            },
            {
                Header: 'Data Access Request',
                accessor: 'dataAccessRequest',
                cellProps: {
                    valign: 'top',
                },
            },
            {
                Header: 'Metadata',
                accessor: 'metadata',
                cellProps: {
                    valign: 'top',
                },
            },
        ],
        []
    );

    useEffect(() => {
        const init = () => {
            if (teamId) {
                getMembersRequest.mutateAsync(teamId).then(({ data: { members } }) => {
                    /**
                     * GAT-1678: currently static
                     *
                     * const initialCheckboxes = {};
                     *
                     * members.forEach((member) => {
                     *   initialCheckboxes[someId] = someBoolean;
                     * });
                     *
                     * setCheckboxes(initialCheckboxes);
                     */

                    setTeamMembers(members);

                    // TODO: GAT-1510:042
                    managerInTeam(teamId);
                });
            }
        };

        init();
    }, [teamId]);

    const handleCloseModal = useCallback(() => {
        setShowModal(false);
    }, []);

    const handleOpenModal = useCallback(() => {
        setShowModal(true);
    }, []);

    const handleMemberAdded = addedMembers => {
        setTeamMembers(addedMembers);
    };

    const handleCheckboxChange = useCallback(({ target: { id, checked } }) => {
        /**
         * GAT-1678: currently static
         *
         * setCheckboxes({
         *    [id]: checked,
         *    ...checkboxes
         * })
         * */
    }, []);

    if (getMembersRequest.isLoading) {
        return (
            <LayoutContent>
                <Loading />
            </LayoutContent>
        );
    }

    return (
        <>
            <LayoutContent>
                <ActionCard
                    title={t('members')}
                    content={
                        <>
                            <P mb={6}>
                                {t('components.AccountTeamMembers.members.description1')}: <a href={SUPPORT_URL}>{SUPPORT_URL}</a>
                            </P>
                            <P mb={6}>{t('components.AccountTeamMembers.members.description2')}</P>
                            <P>{t('components.AccountTeamMembers.members.description3')}</P>
                        </>
                    }
                    action={
                        isTeamManager && (
                            <Button variant='primary' onClick={handleOpenModal}>
                                {t('components.AccountTeamMembers.members.add')}
                            </Button>
                        )
                    }
                    mb={4}
                />

                {teamMembers.length <= 0 && <MessageNotFound word='members' />}
                {teamMembers.length > 0 && (
                    <Card>
                        <Table
                            columns={columns}
                            data={teamMembers.map(({ lastname, firstname, id, bio, organisation }) => {
                                /**
                                 * GAT-1678: currently static
                                 * */
                                const idAdmin = `${id}_admin`;
                                const idDARManager = `${id}_dataAccessRequest_manager`;
                                const idDARReviewer = `${id}_dataAccessRequest_reviewer`;
                                const idMetadataManager = `${id}_metadata_manager`;
                                const idMetadataEditor = `${id}_metadata_editor`;

                                return {
                                    name: (
                                        <>
                                            <Typography as={Link} to={`/person/${id}`} color='purple500'>
                                                {firstname} {lastname}
                                            </Typography>
                                            <Typography color='grey600'>{organisation || bio}</Typography>
                                        </>
                                    ),
                                    teamAdmin: (
                                        <Checkbox label={t('admin')} onChange={handleCheckboxChange} checked={idAdmin} id={idAdmin} />
                                    ),
                                    dataAccessRequest: (
                                        <>
                                            <Checkbox
                                                label={t('manager')}
                                                onChange={handleCheckboxChange}
                                                checked={checkboxes[idDARManager]}
                                                id={idDARManager}
                                            />
                                            <Checkbox
                                                label={t('reviewer')}
                                                onChange={handleCheckboxChange}
                                                checked={checkboxes[idDARReviewer]}
                                                id={idDARReviewer}
                                            />
                                        </>
                                    ),
                                    metadata: (
                                        <>
                                            <Checkbox
                                                label={t('manager')}
                                                onChange={handleCheckboxChange}
                                                checked={checkboxes[idMetadataManager]}
                                                id={idMetadataManager}
                                            />
                                            <Checkbox
                                                label={t('editor')}
                                                onChange={handleCheckboxChange}
                                                checked={checkboxes[idMetadataEditor]}
                                                id={idMetadataEditor}
                                            />
                                        </>
                                    ),
                                };
                            })}
                        />
                    </Card>
                )}

                <AccountTeamMembersModal open={showModal} close={handleCloseModal} teamId={teamId} onMemberAdded={handleMemberAdded} />
            </LayoutContent>
        </>
    );
};

AccountTeamMembers.propTypes = {
    teamId: PropTypes.string.isRequired,
};

export default AccountTeamMembers;
