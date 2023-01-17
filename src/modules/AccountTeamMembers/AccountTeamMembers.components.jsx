import { Typography, IconButton, Box } from 'hdruk-react-core';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { Checkbox, Popover, PopoverMenu } from 'components';
import { useTranslation } from 'react-i18next';

import { memberPropTypes } from '../../types';
import { ReactComponent as WastebinIcon } from '../../images/icons/wastebin.svg';
import { ReactComponent as QuestionMarkIcon } from '../../images/icons/question-mark.svg';

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

const CheckboxCell = ({ onChange, memberId, role, label, checkboxValues }) => {
    const handleChange = ({ target: { checked } }) => onChange({ memberId, role, checked });

    return <Checkbox label={label} onChange={handleChange} checked={!!checkboxValues?.[memberId]?.[role]} id={`${memberId}_${role}`} />;
};

CheckboxCell.propTypes = {
    onChange: PropTypes.func.isRequired,
    memberId: PropTypes.string.isRequired,
    role: PropTypes.string.isRequired,
    label: PropTypes.string.isRequired,
    checkboxValues: PropTypes.objectOf(PropTypes.objectOf(PropTypes.bool)).isRequired,
};

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

export { ActionCell, NameCell, CheckboxCell, HeaderTooltip };
