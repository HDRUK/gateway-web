import React from 'react';
//import { getURL, getCMSURL }  from '../src/pages/commonComponents/BaseURL';
import { UatbetaUrls, AppspotUrls, LocalhostUrls } from './mocks/urlMock';

describe('Check URL translation when in UAT BETA', () => {
	const { location } = window;

	beforeAll((): void => {
		delete window.location;
		window.location = {
			href: UatbetaUrls.web,
		};
	});

	afterAll((): void => {
		window.location = location;
		jest.resetModules();
	});

	it('Returns CMS URL correct', () => {
		expect(require('../src/pages/commonComponents/BaseURL').getCMSURL()).toEqual(UatbetaUrls.cms);
	});

	it('Returns API URL correct', () => {
		expect(require('../src/pages/commonComponents/BaseURL').getURL()).toEqual(UatbetaUrls.api);
	});
});

describe('Check URL translation when running in cloud console', () => {
	const { location } = window;

	beforeAll((): void => {
		delete window.location;
		window.location = {
			href: AppspotUrls.web,
			origin: AppspotUrls.web,
		};
	});

	afterAll((): void => {
		window.location = location;
		jest.resetModules();
	});

	it('Returns CMS URL correct', () => {
		expect(require('../src/pages/commonComponents/BaseURL').getCMSURL()).toEqual(AppspotUrls.cms);
	});

	it('Returns API URL correct', () => {
		expect(require('../src/pages/commonComponents/BaseURL').getURL()).toEqual(AppspotUrls.api);
	});
});

describe('Check URL translation when running in local machine', () => {
	const { location } = window;

	beforeAll((): void => {
		delete window.location;
		window.location = {
			href: LocalhostUrls.web,
		};
	});

	afterAll((): void => {
		window.location = location;
		jest.resetModules();
	});

	it('Returns CMS URL correct', () => {
		expect(require('../src/pages/commonComponents/BaseURL').getURL()).toEqual(LocalhostUrls.cms);
	});

	it('Returns API URL correct', () => {
		expect(require('../src/pages/commonComponents/BaseURL').getCMSURL()).toEqual(LocalhostUrls.api);
	});
});
