import { Row, Col, DropdownButton, Dropdown } from 'react-bootstrap';
import moment from 'moment';
import InlineSVG from 'react-inlinesvg/esm';

import { Icon } from 'components';

import iconTick from '../../../images/tick.svg';
import iconRejected from '../../../images/Application_rejected.svg';

const TeamInfo = ({ updatedAt, publisher, teamManagers, membersCount, editTeam }) => {
    const questionBankEnabled = publisher?.publisherDetails?.questionBank?.enabled;
    const dataUseWidgetEnabled = publisher?.publisherDetails?.dataUse?.widget?.enabled;
    const questionBankStatusIcon = questionBankEnabled ? iconTick : iconRejected;
    const dataUseWidgetStatusIcon = dataUseWidgetEnabled ? iconTick : iconRejected;

    let teamManagerNames = '';

    return (
        <Row className='entryBox gray800-14'>
            <Col sm={12} lg={2}>
                {moment(updatedAt).format('D MMMM YYYY HH:mm')}
            </Col>
            <Col sm={12} lg={2}>
                {publisher.name}
            </Col>
            <Col sm={12} lg={2}>
                {teamManagers &&
                    teamManagers.length > 0 &&
                    teamManagers.map((teamManager, index) => {
                        teamManagerNames += `${teamManager.firstname} ${teamManager.lastname}${
                            teamManagers.length === index + 1 ? '' : ', '
                        }`;
                    })}
                <p className='gray800-14'>
                    {teamManagerNames ? teamManagerNames.substr(0, 35) + (teamManagerNames.length > 35 ? '...' : '') : ''}
                </p>
            </Col>
            <Col sm={12} lg={2}>
                <p className='text-center'>{membersCount}</p>
            </Col>
            <Col sm={12} lg={1}>
                <p className='text-center'>
                    <Icon mr={2} size='2xl' svg={<InlineSVG src={questionBankStatusIcon} />} />
                </p>
            </Col>
            <Col sm={12} lg={1}>
                <p className='text-center'>
                    <Icon mr={2} size='2xl' svg={<InlineSVG src={dataUseWidgetStatusIcon} />} />
                </p>
            </Col>
            <Col sm={12} lg={2}>
                <DropdownButton variant='outline-secondary' alignRight title='Actions' className='floatRight'>
                    <Dropdown.Item onClick={() => editTeam(publisher, teamManagers)} className='black-14'>
                        Edit
                    </Dropdown.Item>
                </DropdownButton>
            </Col>
        </Row>
    );
};

export default TeamInfo;
