import React from 'react';
import { render } from 'testUtils';
import AccountTeamMembersModal from './AccountTeamMembersModal';

describe('AccountTeamMembersModal', () => {
    it('Then matches the previous snapshot', () => {
        const wrapper = render(<AccountTeamMembersModal onClose={jest.fn()} isOpen teamId='1234' onMemberAdded={jest.fn()} />);

        expect(wrapper.container).toMatchSnapshot();
    });
});
