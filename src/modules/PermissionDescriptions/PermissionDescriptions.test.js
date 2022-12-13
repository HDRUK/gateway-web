import '@testing-library/jest-dom/extend-expect';
import { ROLES_ADMIN, ROLES_REVIEWER } from 'configs';
import { testUtils } from '../../../test';
import PermissionDescriptions from './PermissionDescriptions';

describe('When PermissionDescriptions is rendered', () => {
    afterEach(() => {
        testUtils.cleanup();
    });
    it('Then renders null if no roles are passed', () => {
        const { container } = testUtils.render(<PermissionDescriptions />);
        expect(container).toBeEmpty();
    });
    it('Then renders the specified role(s)', () => {
        testUtils.render(<PermissionDescriptions roles={['admin']} />);

        expect(testUtils.screen.getByText(`${ROLES_ADMIN.rolePlural}:`)).toBeInTheDocument();
        expect(testUtils.screen.getByText(ROLES_ADMIN.roleDescription)).toBeInTheDocument();
        expect(testUtils.screen.queryByText(`${ROLES_REVIEWER.rolePlural}:`)).not.toBeInTheDocument();
        expect(testUtils.screen.queryByText(ROLES_REVIEWER.roleDescription)).not.toBeInTheDocument();
    });
});
