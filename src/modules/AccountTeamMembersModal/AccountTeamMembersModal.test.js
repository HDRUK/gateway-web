import { testUtils } from '../../../test';
import AccountTeamMembersModal from './AccountTeamMembersModal';

describe('AccountTeamMembersModal', () => {
    it('Then matches the previous snapshot', () => {
        const wrapper = testUtils.render(<AccountTeamMembersModal onClose={jest.fn()} isOpen teamId='1234' onMembersAdded={jest.fn()} />);

        expect(wrapper.container).toMatchSnapshot();
    });
});
