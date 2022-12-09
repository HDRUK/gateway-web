import DarHelper from './darHelperUtils.util';
import { formSchema, uniqueSchema, uniquePages, uniqueFormPanels } from './__mocks__/darHelperUtils.mock';

describe('Test DarHelper Utility', () => {
    it('should test function removeStaticPages', () => {
        const schema = darHelperUtils.removeStaticPages(formSchema);
        const { pages, formPanels } = { ...schema };
        expect(pages).toEqual(uniquePages);
        expect(formPanels).toEqual(uniqueFormPanels);
        expect(schema).toEqual(uniqueSchema);
    });
});
