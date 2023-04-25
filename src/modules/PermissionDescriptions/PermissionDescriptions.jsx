/** @jsxImportSource @emotion/react */
import { useMemo } from 'react';
import { ROLES_DAR_MANAGER, ROLES_METADATA_MANAGER, ROLES_REVIEWER, ROLES_METADATA_EDITOR, ROLES_TEAM_ADMIN } from 'configs';
import PropTypes from 'prop-types';
import { P } from 'hdruk-react-core';
import * as styles from './PermissionDescriptions.styles';

const PermissionDescriptions = ({ roles }) => {
    const descriptions = useMemo(() => {
        return [ROLES_DAR_MANAGER, ROLES_METADATA_MANAGER, ROLES_REVIEWER, ROLES_METADATA_EDITOR, ROLES_TEAM_ADMIN].filter(role =>
            roles.includes(role.value)
        );
    }, [roles]);

    if (!descriptions.length) return null;

    return (
        <ul data-testid='PermissionDescriptions' css={styles.root()}>
            {descriptions.map((description, index) => {
                return (
                    // eslint-disable-next-line react/no-array-index-key
                    <li key={index}>
                        <P>
                            <P weight='bold' as='span' mr={1}>
                                {description.tooltipLabel}:
                            </P>
                            {description.tooltipDescription}
                        </P>
                    </li>
                );
            })}
        </ul>
    );
};

PermissionDescriptions.propTypes = {
    roles: PropTypes.arrayOf(PropTypes.string),
};

PermissionDescriptions.defaultProps = {
    roles: [],
};

export default PermissionDescriptions;
