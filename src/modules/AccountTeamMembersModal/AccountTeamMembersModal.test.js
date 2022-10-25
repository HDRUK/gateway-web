import React from 'react';
import { render, waitFor, screen, cleanup } from 'testUtils';
import '@testing-library/jest-dom/extend-expect';
import AccountTeamMembersModal from './AccountTeamMembersModal';
import { server } from '../../services/mockServer';

describe('AccountTeamMembersModal', () => {
    beforeAll(() => {
        server.listen();
    });

    afterEach(() => {
        server.resetHandlers();
    });

    afterAll(() => {
        server.close();
    });

    afterEach(() => {
        cleanup();
    });
    it('Then matches the previous snapshot', () => {
        const wrapper = render(<AccountTeamMembersModal onClose={jest.fn()} isOpen teamId='1234' onMemberAdded={jest.fn()} />);
        expect(wrapper.container).toMatchSnapshot();
    });
    it('Then disaplay correct description', async () => {
        render(<AccountTeamMembersModal onClose={jest.fn()} isOpen teamId='1234' onMemberAdded={jest.fn()} />);

        await waitFor(() => {
            expect(screen.getByText('Add members to your team')).toBeInTheDocument();
            expect(
                screen.getByText('Users that you want to add to your team must already have an account on the Gateway.')
            ).toBeInTheDocument();
        });
    });
    it('Then calls onClose when cancelling', async () => {
        const onCloseMock = jest.fn();
        render(<AccountTeamMembersModal onClose={onCloseMock} isOpen teamId='1234' onMemberAdded={jest.fn()} />);

        await waitFor(() => {
            expect(screen.getByText('Add members to your team')).toBeInTheDocument();
        });

        const cancelButton = screen.getByText('Cancel');
        cancelButton.click();
        expect(onCloseMock).toHaveBeenCalledWith();
    });
});
