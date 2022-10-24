import React from 'react';
import { render } from 'testUtils';
import AccountTeamMembersModal from './AccountTeamMembersModal';

describe('AccountTeamMembersModal', () => {
    it('Then matches the previous snapshot', () => {
        const wrapper = render(<AccountTeamMembersModal close={jest.fn()} open={jest.fn()} teamId='1234' onMemberAdded={jest.fn()} />);

        expect(wrapper.container).toMatchSnapshot();
    });
});
