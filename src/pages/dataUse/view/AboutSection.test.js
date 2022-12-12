import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import AboutSection from './AboutSection';

const renderToolTip = jest.fn();
const clickHandler = jest.fn();
let wrapper;
const button = 'organisation-name-details-sm-button';
describe('Given the AboutSection component', () => {
    describe('When it is rendered', () => {
        beforeAll(() => {
            wrapper = render(
                <AboutSection
                    heading='Organisation name'
                    renderTooltip={renderToolTip}
                    id='organisation-name-details'
                    toolTipText='The name of the legal entity that signs the contract to access the data.'
                />
            );
        });

        it('Then matches the previous snapshot', () => {
            expect(wrapper.container).toMatchSnapshot();
        });

        it('Heading should be displayed', () => {
            expect(screen.getByTestId(`section-heading`)).toHaveTextContent(`Organisation name`);
        });
        it('showMoreButton should be not be displayed', () => {
            expect(screen.queryByTestId(button)).toBeNull();
        });
    });

    describe('When showMoreButton is true', () => {
        beforeAll(() => {
            const { rerender } = wrapper;
            rerender(
                <AboutSection
                    heading='Organisation name'
                    renderTooltip={renderToolTip}
                    id='organisation-name-details'
                    showMoreButton={true}
                    showLess={true}
                    onClickHandler={clickHandler}
                    toolTipText='The name of the legal entity that signs the contract to access the data.'
                />
            );
        });

        it('Then showMoreButton  should be visible', () => {
            expect(screen.getByTestId(button)).toBeTruthy();
        });

        it('On clicking showMoreButton  clickHander should be called', () => {
            fireEvent.click(screen.getByTestId(button));
            expect(clickHandler).toHaveBeenCalled();
        });
    });
});
