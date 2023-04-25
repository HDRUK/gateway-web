import { testUtils } from '../../../test';

import Popover from './Popover';
import '@testing-library/jest-dom/extend-expect';

describe('Given the Popover component', () => {
    describe('When it is rendered', () => {
        afterEach(() => {
            testUtils.cleanup();
        });

        it('Then matches the previous snapshot', async () => {
            const wrapper = testUtils.render(<Popover content={<div>content</div>} />);
            expect(wrapper.container).toMatchSnapshot();
        });

        it('Then renders the trigger label', () => {
            testUtils.render(<Popover content={<div>content</div>} trigger='this is my trigger' />);
            expect(testUtils.screen.getByText('this is my trigger')).toBeInTheDocument();
        });

        it('When the trigger is clicked shows the content', async () => {
            testUtils.render(<Popover content={<div>content</div>} trigger='this is my trigger' />);
            expect(testUtils.screen.queryByText('content')).not.toBeInTheDocument();
            testUtils.screen.getByRole('button').click();
            expect(testUtils.screen.getByText('content')).toBeInTheDocument();
        });

        it('When the trigger is moused-over shows the content', async () => {
            testUtils.render(<Popover actionType='hover' content={<div>content</div>} trigger='this is my trigger' />);
            expect(testUtils.screen.queryByText('content')).not.toBeInTheDocument();
            testUtils.fireEvent.mouseOver(testUtils.screen.getByRole('button'));
            expect(testUtils.screen.getByText('content')).toBeInTheDocument();
        });

        it('Then renders the default ellipsis icon if a trigger is not passed', () => {
            const { container } = testUtils.render(<Popover content={<div>content</div>} />);
            const icon = container.querySelector('icon-mock');
            expect(testUtils.screen.queryByText('this is my trigger')).not.toBeInTheDocument();
            expect(icon).toBeInTheDocument();
        });
    });
});
