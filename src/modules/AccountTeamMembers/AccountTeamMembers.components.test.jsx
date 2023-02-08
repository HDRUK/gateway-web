import { ROLE_CUSTODIAN_TEAM_ADMIN } from 'consts';
import { testUtils } from '../../../test';
import { teamMembersMock } from '../../../test/mocks/teamsServiceMock';
import { HeaderTooltip, NameCell, CheckboxCell } from './AccountTeamMembers.components';
import '@testing-library/jest-dom/extend-expect';

const changeMock = jest.fn();

describe('Given the AccountTeamMembers components', () => {
    afterEach(() => {
        changeMock.mockReset();
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

    describe('When CheckboxCell is rendered', () => {
        let wrapper;

        beforeAll(() => {
            wrapper = testUtils.render(
                <CheckboxCell
                    userId='1234'
                    role={ROLE_CUSTODIAN_TEAM_ADMIN}
                    checkboxValues={{
                        1234: { [ROLE_CUSTODIAN_TEAM_ADMIN]: true },
                    }}
                    label='Admin'
                    onChange={changeMock}
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
