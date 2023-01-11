import { testUtils } from '../../../test';
import { teamMembersMock } from '../../../test/mocks/teamsServiceMock';
import { HeaderTooltip, NameCell, TeamAdminCell, DataAccessRequestCell, MetadataCell } from './AccountTeamMembers.components';
import '@testing-library/jest-dom/extend-expect';

const changeMock = jest.fn();

describe('Given the AccountTeamMembers components', () => {
    afterEach(() => {
        changeMock.mockReset();
        // testUtils.cleanup();
    });

    describe('When NameCell is rendered', () => {
        let wrapper;

        beforeAll(() => {
            wrapper = testUtils.render(<NameCell member={teamMembersMock[0]} />);
        });

        afterAll(() => {
            testUtils.cleanup();
        });

        it('Then matches the previous snapshot', async () => {
            expect(wrapper.container).toMatchSnapshot();
        });

        it('Then shows a loader', async () => {
            expect(testUtils.screen.getByText(/John Smith/)).toBeTruthy();
            expect(testUtils.screen.getByText(/HDR UK/)).toBeTruthy();
        });
    });

    describe('When TeamAdminCell is rendered', () => {
        let wrapper;

        beforeAll(() => {
            wrapper = testUtils.render(
                <TeamAdminCell
                    member={teamMembersMock[0]}
                    onChange={changeMock}
                    checkboxes={{
                        '5678_admin': true,
                    }}
                />
            );
        });

        afterAll(() => {
            testUtils.cleanup();
        });

        it('Then matches the previous snapshot', async () => {
            expect(wrapper.container).toMatchSnapshot();
        });

        it('Then has the correct checkboxes checked', async () => {
            const adminCheckbox = testUtils.screen.getByLabelText('Admin');

            expect(adminCheckbox.checked).toBeTruthy();
        });

        describe('And admin is clicked', () => {
            it('Then calls onChange', () => {
                const checkbox = testUtils.screen.getByLabelText('Admin');

                testUtils.fireEvent.click(checkbox);

                expect(changeMock).toHaveBeenCalled();
            });
        });
    });

    describe('When DataAccessRequestCell is rendered', () => {
        let wrapper;

        beforeAll(() => {
            wrapper = testUtils.render(
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

        afterAll(() => {
            testUtils.cleanup();
        });

        it('Then matches the previous snapshot', async () => {
            expect(wrapper.container).toMatchSnapshot();
        });

        it('Then has the correct checkboxes checked', async () => {
            const managerCheckbox = testUtils.screen.getByLabelText('Manager');
            const reviewerCheckbox = testUtils.screen.getByLabelText('Reviewer');

            expect(managerCheckbox.checked).toBeTruthy();
            expect(reviewerCheckbox.checked).toBeFalsy();
        });

        describe('And manager is clicked', () => {
            it('Then calls onChange', () => {
                const checkbox = testUtils.screen.getByLabelText('Manager');

                testUtils.fireEvent.click(checkbox);

                expect(changeMock).toHaveBeenCalled();
            });
        });

        describe('And reviewer is clicked', () => {
            it('Then calls onChange', () => {
                const checkbox = testUtils.screen.getByLabelText('Reviewer');

                testUtils.fireEvent.click(checkbox);

                expect(changeMock).toHaveBeenCalled();
            });
        });
    });

    describe('When MetadataCell is rendered', () => {
        let wrapper;

        beforeAll(() => {
            wrapper = testUtils.render(
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

        afterAll(() => {
            testUtils.cleanup();
        });

        it('Then matches the previous snapshot', async () => {
            expect(wrapper.container).toMatchSnapshot();
        });

        it('Then has the correct checkboxes checked', async () => {
            const managerCheckbox = testUtils.screen.getByLabelText('Manager');
            const editorCheckbox = testUtils.screen.getByLabelText('Editor');

            expect(managerCheckbox.checked).toBeTruthy();
            expect(editorCheckbox.checked).toBeFalsy();
        });

        describe('And manager is clicked', () => {
            it('Then calls onChange', () => {
                const checkbox = testUtils.screen.getByLabelText('Manager');

                testUtils.fireEvent.click(checkbox);

                expect(changeMock).toHaveBeenCalled();
            });
        });

        describe('And editor is clicked', () => {
            it('Then calls onChange', () => {
                const checkbox = testUtils.screen.getByLabelText('Editor');

                testUtils.fireEvent.click(checkbox);

                expect(changeMock).toHaveBeenCalled();
            });
        });
    });
    describe('When HeaderTooltip is rendered', () => {
        it('Then renders just the heading', () => {
            testUtils.render(<HeaderTooltip header='My header' content='My content' />);
            expect(testUtils.screen.getByText('My header')).toBeInTheDocument();
            expect(testUtils.screen.queryByText('My content')).not.toBeInTheDocument();
        });
        it('When you mouseover the content is displayed', () => {
            const { container } = testUtils.render(<HeaderTooltip header='My header' content='My content' />);
            const iconTrigger = container.querySelector('icon-mock');

            testUtils.fireEvent.mouseOver(iconTrigger);
            expect(testUtils.screen.queryByText('My content')).toBeInTheDocument();
        });
    });
});
