import React from 'react';
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
		expect(require('../src/configs/url.config').cmsURL).toEqual(UatbetaUrls.cms);
	});

	it('Returns API URL correct', () => {
		expect(require('../src/configs/url.config').baseURL).toEqual(UatbetaUrls.api);
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
		expect(require('../src/configs/url.config').cmsURL).toEqual(AppspotUrls.cms);
	});

	it('Returns API URL correct', () => {
		expect(require('../src/configs/url.config').baseURL).toEqual(AppspotUrls.api);
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
		expect(require('../src/configs/url.config').cmsURL).toEqual(LocalhostUrls.cms);
	});

	it('Returns API URL correct', () => {
		expect(require('../src/configs/url.config').baseURL).toEqual(LocalhostUrls.api);
	});
});
