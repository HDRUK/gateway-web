import { Typography, IconButton, Box } from 'hdruk-react-core';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { Checkbox, Popover, PopoverMenu } from 'components';
import { useTranslation } from 'react-i18next';
import { memberPropTypes } from '../../types';
import { ReactComponent as WastebinIcon } from '../../images/icons/wastebin.svg';
import { ReactComponent as QuestionMarkIcon } from '../../images/icons/question-mark.svg';

const cellProps = {
    member: memberPropTypes.isRequired,
    onChange: PropTypes.func.isRequired,
    checkboxes: PropTypes.objectOf(PropTypes.bool).isRequired,
};

const ActionCell = ({ member: { id }, onDeleteMember }) => {
    const { t } = useTranslation();
    const items = [
        {
            label: t('removeUser'),
            icon: WastebinIcon,
            action: () => onDeleteMember(id),
        },
    ];
    return <Popover content={<PopoverMenu items={items} />} />;
};

ActionCell.propTypes = {
    member: memberPropTypes.isRequired,
    onDeleteMember: PropTypes.func.isRequired,
};

const NameCell = ({ member: { lastname, firstname, id, bio, organisation } }) => (
    <>
        <Typography as={Link} to={`/person/${id}`} color='purple500'>
            {firstname} {lastname}
        </Typography>
        <Typography color='grey600'>{organisation || bio}</Typography>
    </>
);

NameCell.propTypes = {
    member: memberPropTypes.isRequired,
};

const TeamAdminCell = ({ member: { id }, onChange, checkboxes }) => {
    const { t } = useTranslation();

    const idAdmin = `${id}_admin`;

    return <Checkbox label={t('admin')} onChange={onChange} checked={checkboxes[idAdmin]} id={idAdmin} />;
};

TeamAdminCell.propTypes = cellProps;

const DataAccessRequestCell = ({ member: { id }, onChange, checkboxes }) => {
    const { t } = useTranslation();

    const idDARManager = `${id}_dataAccessRequest_manager`;
    const idDARReviewer = `${id}_dataAccessRequest_reviewer`;

    return (
        <>
            <Checkbox label={t('manager')} onChange={onChange} checked={checkboxes[idDARManager]} id={idDARManager} />
            <Checkbox label={t('reviewer')} onChange={onChange} checked={checkboxes[idDARReviewer]} id={idDARReviewer} />
        </>
    );
};

DataAccessRequestCell.propTypes = cellProps;

const MetadataCell = ({ member: { id }, onChange, checkboxes }) => {
    const { t } = useTranslation();

    const idMetadataManager = `${id}_metadata_manager`;
    const idMetadataEditor = `${id}_metadata_editor`;

    return (
        <>
            <Checkbox label={t('manager')} onChange={onChange} checked={checkboxes[idMetadataManager]} id={idMetadataManager} />
            <Checkbox label={t('editor')} onChange={onChange} checked={checkboxes[idMetadataEditor]} id={idMetadataEditor} />
        </>
    );
};

MetadataCell.propTypes = cellProps;

const HeaderTooltip = ({ header, content }) => (
    <Box display='flex' alignItems='center'>
        {header}
        <Popover
            actionType='hover'
            position='top'
            content={content}
            trigger={<IconButton ml={2} size='xxs' svg={<QuestionMarkIcon />} />}
        />
    </Box>
);

HeaderTooltip.propTypes = {
    header: PropTypes.string.isRequired,
    content: PropTypes.node.isRequired,
};

export { ActionCell, NameCell, DataAccessRequestCell, TeamAdminCell, MetadataCell, HeaderTooltip };
