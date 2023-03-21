import { render } from '@testing-library/react';
import Card from './Card';
import CardHeader from './CardHeader';
import CardBody from './CardBody';
import CardFooter from './CardFooter';

let wrapper;

describe('Given the Card component', () => {
    describe('When it is rendered', () => {
        beforeAll(() => {
            wrapper = render(
                <Card>
                    <CardHeader>Header</CardHeader>
                    <CardBody>Body</CardBody>
                    <CardFooter>Footer</CardFooter>
                </Card>,
                {
                    wrapper: Providers,
                }
            );
        });

        it('Then matches the previous snapshot', async () => {
            expect(wrapper.container).toMatchSnapshot();
        });

        it('Then contains the correct content', async () => {
            expect(wrapper.getByText('Header')).toBeTruthy();
            expect(wrapper.getByText('Body')).toBeTruthy();
            expect(wrapper.getByText('Footer')).toBeTruthy();
        });
    });
});
