import { render, screen, cleanup, fireEvent } from 'testUtils';

import Popover from './Popover';
import '@testing-library/jest-dom/extend-expect';

describe('Given the Popover component', () => {
    describe('When it is rendered', () => {
        afterEach(() => {
            cleanup();
        });

        it('Then matches the previous snapshot', async () => {
            const wrapper = render(<Popover content={<div>content</div>} />);
            expect(wrapper.container).toMatchSnapshot();
        });

        it('Then renders the trigger label', () => {
            render(<Popover content={<div>content</div>} trigger='this is my trigger' />);
            expect(screen.getByText('this is my trigger')).toBeInTheDocument();
        });

        it('When the trigger is clicked shows the content', async () => {
            render(<Popover content={<div>content</div>} trigger='this is my trigger' />);
            expect(screen.queryByText('content')).not.toBeInTheDocument();
            screen.getByRole('button').click();
            expect(screen.getByText('content')).toBeInTheDocument();
        });

        it('When the trigger is moused-over shows the content', async () => {
            render(<Popover actionType='hover' content={<div>content</div>} trigger='this is my trigger' />);
            expect(screen.queryByText('content')).not.toBeInTheDocument();
            fireEvent.mouseOver(screen.getByRole('button'));
            expect(screen.getByText('content')).toBeInTheDocument();
        });

        it('Then renders the default ellipsis icon if a trigger is not passed', () => {
            const { container } = render(<Popover content={<div>content</div>} />);
            const icon = container.querySelector('icon-mock');
            expect(screen.queryByText('this is my trigger')).not.toBeInTheDocument();
            expect(icon).toBeInTheDocument();
        });
    });
});
