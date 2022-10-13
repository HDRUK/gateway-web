import React, { useEffect, useState, useMemo } from 'react';
import axios from 'axios';
import { isEmpty } from 'lodash';
import { Card, CardBody, Typography, Button, CardHeader, P, Box } from 'hdruk-react-core';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import Table from '../../components/Table';
import { ROLE_LIST, SUPPORT_URL } from '../../configs/constants';
import MessageNotFound from '../../pages/commonComponents/MessageNotFound';
import Loading from '../../pages/commonComponents/Loading';
import AccountMembersModal from '../AccountMembersModal';
import { LayoutContent } from '../../components/Layout';
import { baseURL } from '../../configs/url.config';
import { useAuth } from '../../context/AuthContext';

export const AccountMembers = ({ team }) => {
    const { userState } = useAuth();
    const [isLoading, setIsLoading] = useState(true);
    const [members, setMembers] = useState([]);
    const [userIsManager, setUserIsManager] = useState(false);
    const [showAccountAddMemberModal, setShowAccountAddMemberModal] = useState(false);
    const [accountMembersId, setAccountMembersId] = useState(team);
    const { t } = useTranslation();

    const columns = useMemo(
        () => [
            {
                Header: 'Name',
                accessor: 'name',
            },
            {
                Header: 'Role',
                accessor: 'role',
            },
        ],
        []
    );

    useEffect(() => {
        setAccountMembersId(team);
    }, [team]);

    const doMembersCall = async () => {
        if (accountMembersId) {
            setIsLoading(true);
            await axios.get(`${baseURL}/api/v1/teams/${accountMembersId}/members`).then(async res => {
                setMembers(res.data.members);
                // TODO: GAT-1510:042
                setUserIsManager(res.data.members.filter(({ id }) => id === userState[0].id).map(({ roles }) => roles[0] === 'manager')[0]);
            });
        }
        setIsLoading(false);
    };

    useEffect(() => {
        doMembersCall().catch(console.error);
    }, [accountMembersId]);

    const onShowAccountMembersModal = () => {
        setShowAccountAddMemberModal(!showAccountAddMemberModal);
    };

    const onMemberAdded = addedMembers => {
        setMembers(addedMembers);
    };

    const getRoles = roles => {
        if (!isEmpty(roles)) {
            const sortedRoles = roles.sort();
            // TODO: GAT-1510:043
            return sortedRoles.map(role => ROLE_LIST[role]).join(', ');
        }
        return '';
    };

    if (isLoading) {
        return (
            <LayoutContent>
                <Loading />
            </LayoutContent>
        );
    }

    return (
        <>
            <LayoutContent>
                <Card mb={4}>
                    <CardHeader>Members</CardHeader>
                    <CardBody>
                        <Box
                            display={{
                                md: 'flex',
                            }}
                            gap={8}>
                            <Box
                                mb={{
                                    xxs: 6,
                                    md: 0,
                                }}
                                flexGrow='1'>
                                <P mb={6}>
                                    {t('components.AccountMembers.members.description1')}: <a href={SUPPORT_URL}>{SUPPORT_URL}</a>
                                </P>
                                <P mb={6}>{t('components.AccountMembers.members.description2')}</P>
                                <P>{t('components.AccountMembers.members.description3')}</P>
                            </Box>
                            <Box
                                display={{
                                    md: 'flex',
                                }}
                                justifyContent='flex-end'
                                flexBasis={{
                                    md: '40%',
                                }}>
                                {userIsManager && (
                                    <Button variant='primary' onClick={onShowAccountMembersModal}>
                                        + Add a new member
                                    </Button>
                                )}
                            </Box>
                        </Box>
                    </CardBody>
                </Card>

                {members.length <= 0 && <MessageNotFound word='members' />}
                {members.length > 0 && (
                    <Card>
                        <Table
                            className='dashboard-results'
                            columns={columns}
                            data={members.map(({ lastname, firstname, id, bio, organisation, roles }) => ({
                                name: (
                                    <>
                                        <Typography as={Link} to={`/person/${id}`} color='purple500'>
                                            {firstname} {lastname}
                                        </Typography>
                                        <Typography color='grey600'>{organisation || bio}</Typography>
                                    </>
                                ),
                                role: getRoles(roles),
                            }))}
                        />
                    </Card>
                )}

                <AccountMembersModal
                    open={showAccountAddMemberModal}
                    close={onShowAccountMembersModal}
                    teamId={accountMembersId}
                    onMemberAdded={onMemberAdded}
                />
            </LayoutContent>
        </>
    );
};

export default AccountMembers;
