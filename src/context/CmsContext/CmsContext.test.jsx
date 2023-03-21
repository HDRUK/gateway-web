import Cookies from 'js-cookie';
import { render, fireEvent, waitFor, screen } from '@testing-library/react';
import { CmsProvider, useCms, withCms } from '.';

let wrapper;

const removeSpy = jest.spyOn(Cookies, 'remove');
const setSpy = jest.spyOn(Cookies, 'set');
const getSpy = jest.spyOn(Cookies, 'get').mockReturnValue(
    JSON.stringify({
        action: 'doSomething',
    })
);

const TestComponent = () => {
    const { data, setData, resetData } = useCms();

    return (
        <>
            <button
                onClick={() => {
                    setData({ action: 'doSomething' });
                }}
                type='button'>
                Set data
            </button>
            <button
                onClick={() => {
                    resetData();
                }}
                type='button'>
                Reset data
            </button>
            {data?.action === 'doSomething' && <span>Something shown</span>}
        </>
    );
};

const TestComponentHOC = withCms(({ cmsData }) => {
    return cmsData?.data ? <span>Something shown</span> : null;
});

describe('Given the GatewayAdvancedSearchDataUtilityWizard component', () => {
    redefineWindow();

    describe('When it is rendered', () => {
        beforeAll(() => {
            wrapper = render(
                <CmsProvider>
                    <TestComponent />
                </CmsProvider>
            );
        });

        it('Then gets the correct cookie', async () => {
            await waitFor(() => expect(getSpy).toHaveBeenCalledWith('cmsData'));
        });

        it('Then shows the correct content', async () => {
            await waitFor(() => expect(screen.getByText(/Something shown/)).toBeTruthy());
        });

        describe('And the data is reset', () => {
            beforeAll(() => {
                const button = wrapper.getByText(/Reset data/);

                fireEvent.click(button);
            });

            it('Then removes a cookie', async () => {
                expect(removeSpy).toHaveBeenCalledWith('cmsData', {
                    domain: 'www.healthdatagateway.org',
                });
            });

            it('Then removes the content', async () => {
                await waitFor(() => expect(wrapper.queryByText(/Something shown/)).toBeFalsy());
            });

            describe('And the data is set', () => {
                beforeEach(async () => {
                    const button = wrapper.getByText(/Set data/);

                    fireEvent.click(button);
                });

                it('Then sets a cookie', async () => {
                    expect(setSpy).toHaveBeenCalledWith('cmsData', '{"action":"doSomething"}', { domain: 'www.healthdatagateway.org' });
                });

                it('Then shows the correct content', async () => {
                    await waitFor(() => expect(wrapper.getByText(/Something shown/)).toBeTruthy());
                });
            });
        });
    });

    describe('When it is a HOC', () => {
        beforeAll(() => {
            wrapper.rerender(
                <CmsProvider>
                    <TestComponentHOC />
                </CmsProvider>
            );
        });

        it('Then shows the correct content', async () => {
            await waitFor(() => expect(wrapper.getByText(/Something shown/)).toBeTruthy());
        });
    });
});
