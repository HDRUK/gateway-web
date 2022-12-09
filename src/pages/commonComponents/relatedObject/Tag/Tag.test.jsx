import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import { toTitleCase } from '../../../../utils/General.util';
import Tag from './Tag';

const props = {
    updateOnFilterBadgeHandler: jest.fn(),
    tagName: 'test',
    tagType: 'phenotype',
    onSearchPage: false,
    activeLink: false,
    url: '/search?search=&tab=Datasets&phenotypes=',
    parentKey: 'phenotypes',
    showTagType: false,
    filter: 'phenotypes',
};
let wrapper;

describe('Given the Tag component', () => {
    describe('When it is rendered', () => {
        beforeAll(() => {
            wrapper = render(<Tag {...props} />);
        });

        it('Then matches the previous snapshot', () => {
            expect(wrapper.container).toMatchSnapshot();
        });

        it(`Then Button should be rendered with className badge-${props.tagType}`, () => {
            expect(screen.getByTestId(`badge-${props.tagName}`)).toBeTruthy();
            expect(screen.getByTestId(`badge-${props.tagName}`)).toHaveClass(`badge-${props.tagType}`);
        });
    });
    describe('And activeLink is true', () => {
        it('Then the Tag without tagID should be rendered with links', () => {
            const { rerender } = wrapper;
            rerender(<Tag {...props} activeLink />);
            expect(screen.getByTestId(`badge-${props.tagName}`)).toBeTruthy();
            expect(screen.getByTestId(`badge-${props.tagName}-link`)).toHaveAttribute('href', `${props.url}${props.tagName}`);
        });
        it('Then with tagID Tag should be rendered with id links', () => {
            const { rerender } = wrapper;
            rerender(<Tag {...props} activeLink tagId='123' />);
            expect(screen.getByTestId(`badge-${props.tagName}`)).toBeTruthy();
            expect(screen.getByTestId(`badge-${props.tagName}-link`)).toHaveAttribute('href', `${props.url}123`);
        });
    });

    describe('And showTagType is true', () => {
        it('Then the Tag  should be rendered with the prefix as TagType ', () => {
            const { rerender } = wrapper;
            rerender(<Tag {...props} activeLink showTagType />);
            expect(screen.getByTestId(`badge-${props.tagName}`)).toBeTruthy();
            expect(screen.getByTestId(`badge-${props.tagName}-link`)).toHaveTextContent(`${toTitleCase(props.tagType)}: ${props.tagName}`);
        });
    });

    describe('And activeLink and onSearchPage is true', () => {
        const { updateOnFilterBadgeHandler } = props;
        it('Then Tag  should be rendered without links', () => {
            const { rerender } = wrapper;
            rerender(<Tag {...props} activeLink onSearchPage />);
            expect(screen.getByTestId(`badge-${props.tagName}`)).toBeTruthy();
            expect(screen.queryByTestId(`badge-${props.tagName}-link`)).toBeNull();
        });
        it('Then onclick Tag updateOnFilterBadgeHandler should be called', () => {
            fireEvent.click(screen.getByTestId(`badge-${props.tagName}`));
            expect(updateOnFilterBadgeHandler.mock.calls.length).toBe(1);
            expect(updateOnFilterBadgeHandler.mock.calls[0][0]).toEqual(props.parentKey);
            expect(updateOnFilterBadgeHandler.mock.calls[0][1]).toEqual({ label: props.tagName, parentKey: props.parentKey });
        });
    });
});
