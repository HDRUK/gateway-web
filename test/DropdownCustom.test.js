import React from 'react';
import DropdownCustom from '../src/pages/DataAccessRequest/components/DropdownCustom/DropdownCustom'; 
import { contributorsInfo, dropdownCustomProps } from './mocks/dataMock';
import moxios from 'moxios';
import { act } from 'react-dom/test-utils';

let wrapper;

beforeEach(function () { 
	moxios.install();
	wrapper = mount(<DropdownCustom classes={dropdownCustomProps.classes} />);
});

afterEach(function () {
	moxios.uninstall();
	wrapper.unmount();  
});

describe('<DropdownCustom />', () => {

    it('allows typing in the text input', async done => {
        await moxios.wait(jest.fn);
		await act(async () => {
			let request = moxios.requests.mostRecent();
			request
				.respondWith({
					status: 200,
					response: { data: contributorsInfo },
				})
				.then(async () => {
					wrapper.update();
                    const mockEvent = {
                        target: { 
                            name: 'safepeopleprimaryapplicantfullname',
                            value: 'Bob'
                        },
                    };
                    expect(wrapper.find('[data-test-id="darContributorTextInput"]').simulate('change', mockEvent)); 
					done(); 
				});
		});
    });

    it('renders with 3 contributors in the dropdown', async done => {
		await moxios.wait(jest.fn);
		await act(async () => {
			let request = moxios.requests.mostRecent();
			request
				.respondWith({
					status: 200,
					response: { data: contributorsInfo },
				})
				.then(async () => {
					wrapper.update();
                    await act(async () => {
                        let input = await wrapper.find('[data-test-id="darContributorTextInput"]');
                        expect(input.simulate('click'));
                    });
					let contributorDropdownOption = await wrapper.find('[data-test-id="darContributorDropdownItem"]').hostNodes();
					expect(contributorDropdownOption.length).toEqual(3);
					done(); 
				});
		});
	});

    it('renders with only the logged in users email displayed', async done => {
		await moxios.wait(jest.fn);
		await act(async () => {
			let request = moxios.requests.mostRecent();
			request
				.respondWith({
					status: 200,
					response: { data: contributorsInfo },
				})
				.then(async () => {
					wrapper.update();
                    await act(async () => {
                        let input = await wrapper.find('[data-test-id="darContributorTextInput"]');
                        expect(input.simulate('click'));
                    });

					let contributorEmail1 = await wrapper.find('[data-test-id="darContributorDropdownEmail0"]')
                    expect(contributorEmail1.text().trim()).toEqual('ciara.ward@paconsulting.com');

                    let contributorEmail2 = await wrapper.find('[data-test-id="darContributorDropdownEmail1"]')
                    expect(contributorEmail2.text().trim()).toEqual('Email address cannot be shared');

                    let contributorEmail3 = await wrapper.find('[data-test-id="darContributorDropdownEmail2"]')
                    expect(contributorEmail3.text().trim()).toEqual('Email address cannot be shared');

					done(); 
				});
		});
	});

    it('renders with the correct organisations shown and hidden', async done => {
		await moxios.wait(jest.fn);
		await act(async () => {
			let request = moxios.requests.mostRecent();
			request
				.respondWith({
					status: 200,
					response: { data: contributorsInfo },
				})
				.then(async () => {
					wrapper.update();
                    await act(async () => {
                        let input = await wrapper.find('[data-test-id="darContributorTextInput"]');
                        expect(input.simulate('click'));
                    });

					let darContributorDropdownOrganisation1 = await wrapper.find('[data-test-id="darContributorDropdownOrganisation0"]')
                    expect(darContributorDropdownOrganisation1.text().trim()).toEqual('test');

                    let darContributorDropdownOrganisation2 = await wrapper.find('[data-test-id="darContributorDropdownOrganisation1"]')
                    expect(darContributorDropdownOrganisation2.text().trim()).toEqual('PA Consulting');

                    let darContributorDropdownOrganisation3 = await wrapper.find('[data-test-id="darContributorDropdownOrganisation2"]')
                    expect(darContributorDropdownOrganisation3.text().trim()).toEqual('Organisation is hidden');

					done(); 
				});
		});
	});
   
});