import { Typography, IconButton, Box } from 'hdruk-react-core';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { Checkbox, Popover, PopoverMenu } from 'components';
import { useTranslation } from 'react-i18next';

import { memo, useMemo } from 'react';
import { memberPropTypes } from '../../types';
import { ReactComponent as WastebinIcon } from '../../images/icons/wastebin.svg';
import { ReactComponent as QuestionMarkIcon } from '../../images/icons/question-mark.svg';

const ActionCell = ({ member: { userId }, onDeleteMember }) => {
    const { t } = useTranslation();
    const items = [
        {
            label: t('removeUser'),
            icon: WastebinIcon,
            action: () => onDeleteMember(userId),
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

const CheckboxCell = memo(({ title, onChange, userId, role, label, checkboxValues, disabled }) => {
    const handleChange = ({ target: { checked } }) => {
        onChange({ userId, roles: { ...checkboxValues, [role]: checked } });
    };

    const isChecked = useMemo(() => !!checkboxValues?.[role], [checkboxValues, role]);

    return (
        <Checkbox title={title} disabled={disabled} label={label} onChange={handleChange} checked={isChecked} id={`${userId}_${role}`} />
    );
});

CheckboxCell.propTypes = {
    onChange: PropTypes.func.isRequired,
    userId: PropTypes.string.isRequired,
    role: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    disabled: PropTypes.bool.isRequired,
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
