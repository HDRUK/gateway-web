import '@testing-library/jest-dom/extend-expect';
import { ROLES_TEAM_ADMIN, ROLES_REVIEWER } from 'configs';
import { ROLE_CUSTODIAN_TEAM_ADMIN } from 'consts';
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
        testUtils.render(<PermissionDescriptions roles={[ROLE_CUSTODIAN_TEAM_ADMIN]} />);

        expect(testUtils.screen.getByText(`${ROLES_TEAM_ADMIN.tooltipLabel}:`)).toBeInTheDocument();
        expect(testUtils.screen.getByText(ROLES_TEAM_ADMIN.tooltipDescription)).toBeInTheDocument();
        expect(testUtils.screen.queryByText(`${ROLES_REVIEWER.tooltipLabel}:`)).not.toBeInTheDocument();
        expect(testUtils.screen.queryByText(ROLES_REVIEWER.tooltipDescription)).not.toBeInTheDocument();
    });
});
