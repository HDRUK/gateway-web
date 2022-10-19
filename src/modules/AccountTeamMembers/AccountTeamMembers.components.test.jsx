import React from 'react';
import { render, fireEvent, screen, cleanup } from 'testUtils';
import { teamMembersMock } from '../../../test/mocks/teamsServiceMock';
import { NameCell, TeamAdminCell, DataAccessRequestCell, MetadataCell } from './AccountTeamMembers.components';

const changeMock = jest.fn();

let wrapper;

describe('Given the AccountTeamMembers components', () => {
    afterEach(() => {
        changeMock.mockReset();
    });

    describe('When NameCell is rendered', () => {
        beforeAll(() => {
            wrapper = render(<NameCell member={teamMembersMock[0]} />);
        });

        it('Then matches the previous snapshot', async () => {
            expect(wrapper.container).toMatchSnapshot();
        });

        it('Then shows a loader', async () => {
            expect(screen.getByText(/John Smith/)).toBeTruthy();
            expect(screen.getByText(/HDR UK/)).toBeTruthy();
        });
    });

    describe('When TeamAdminCell is rendered', () => {
        beforeAll(() => {
            wrapper.rerender(
                <TeamAdminCell
                    member={teamMembersMock[0]}
                    onChange={changeMock}
                    checkboxes={{
                        '5678_admin': true,
                    }}
                />
            );
        });

        it('Then matches the previous snapshot', async () => {
            expect(wrapper.container).toMatchSnapshot();
        });

        it('Then has the correct checkboxes checked', async () => {
            const adminCheckbox = screen.getByLabelText('Admin');

            expect(adminCheckbox.checked).toBeTruthy();
        });

        describe('And admin is clicked', () => {
            it('Then calls onChange', () => {
                const checkbox = screen.getByLabelText('Admin');

                fireEvent.click(checkbox);

                expect(changeMock).toHaveBeenCalled();
            });
        });
    });

    describe('When DataAccessRequestCell is rendered', () => {
        beforeAll(() => {
            wrapper.rerender(
                <DataAccessRequestCell
                    member={teamMembersMock[0]}
                    onChange={changeMock}
                    checkboxes={{
                        '5678_dataAccessRequest_manager': true,
                        '5678_dataAccessRequest_reviewer': false,
                    }}
                />
            );
        });

        it('Then matches the previous snapshot', async () => {
            expect(wrapper.container).toMatchSnapshot();
        });

        it('Then has the correct checkboxes checked', async () => {
            const managerCheckbox = screen.getByLabelText('Manager');
            const reviewerCheckbox = screen.getByLabelText('Reviewer');

            expect(managerCheckbox.checked).toBeTruthy();
            expect(reviewerCheckbox.checked).toBeFalsy();
        });

        describe('And manager is clicked', () => {
            it('Then calls onChange', () => {
                const checkbox = screen.getByLabelText('Manager');

                fireEvent.click(checkbox);

                expect(changeMock).toHaveBeenCalled();
            });
        });

        describe('And reviewer is clicked', () => {
            it('Then calls onChange', () => {
                const checkbox = screen.getByLabelText('Reviewer');

                fireEvent.click(checkbox);

                expect(changeMock).toHaveBeenCalled();
            });
        });
    });

    describe('When MetadataCell is rendered', () => {
        beforeAll(() => {
            wrapper.rerender(
                <MetadataCell
                    member={teamMembersMock[0]}
                    onChange={changeMock}
                    checkboxes={{
                        '5678_metadata_manager': true,
                        '5678_metdata_editor': false,
                    }}
                />
            );
        });

        it('Then matches the previous snapshot', async () => {
            expect(wrapper.container).toMatchSnapshot();
        });

        it('Then has the correct checkboxes checked', async () => {
            const managerCheckbox = screen.getByLabelText('Manager');
            const editorCheckbox = screen.getByLabelText('Editor');

            expect(managerCheckbox.checked).toBeTruthy();
            expect(editorCheckbox.checked).toBeFalsy();
        });

        describe('And manager is clicked', () => {
            it('Then calls onChange', () => {
                const checkbox = screen.getByLabelText('Manager');

                fireEvent.click(checkbox);

                expect(changeMock).toHaveBeenCalled();
            });
        });

        describe('And editor is clicked', () => {
            it('Then calls onChange', () => {
                const checkbox = screen.getByLabelText('Editor');

                fireEvent.click(checkbox);

                expect(changeMock).toHaveBeenCalled();
            });
        });
    });
});
