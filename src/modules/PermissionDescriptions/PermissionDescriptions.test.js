import React from 'react';
import { render, screen, cleanup } from 'testUtils';
import PermissionDescriptions from './PermissionDescriptions';
import '@testing-library/jest-dom/extend-expect';
import { ROLES_ADMIN, ROLES_REVIEWER } from 'configs';

describe('When PermissionDescriptions is rendered', () => {
    afterEach(() => {
        cleanup();
    });
    it('Then renders null if no roles are passed', () => {
        const { container } = render(<PermissionDescriptions />);
        expect(container).toBeEmpty();
    });
    it('Then renders the specified role(s)', () => {
        render(<PermissionDescriptions roles={['admin']} />);

        expect(screen.getByText(`${ROLES_ADMIN.rolePlural}:`)).toBeInTheDocument();
        expect(screen.getByText(ROLES_ADMIN.roleDescription)).toBeInTheDocument();
        expect(screen.queryByText(`${ROLES_REVIEWER.rolePlural}:`)).not.toBeInTheDocument();
        expect(screen.queryByText(ROLES_REVIEWER.roleDescription)).not.toBeInTheDocument();
    });
});
