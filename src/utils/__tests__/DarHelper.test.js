import DarHelper from '../DarHelper.util';
import { formSchema, uniqueSchema, uniquePages, uniqueFormPanels } from '../__mocks__/DarHelper.mock';

describe('Test DarHelper Utility', () => {
	it('should test function removeStaticPages', () => {
		let schema = DarHelper.removeStaticPages(formSchema);
		let { pages, formPanels } = { ...schema };
		expect(pages).toEqual(uniquePages);
		expect(formPanels).toEqual(uniqueFormPanels);
		expect(schema).toEqual(uniqueSchema);
	});
});
