import { removeStaticPages } from './DarHelper.util';
import { formSchema, uniqueSchema, uniquePages, uniqueFormPanels } from './__mocks__/DarHelper.mock';

describe('Test DarHelper Utility', () => {
    it('should test function removeStaticPages', () => {
        const schema = removeStaticPages(formSchema);
        const { pages, formPanels } = { ...schema };
        expect(pages).toEqual(uniquePages);
        expect(formPanels).toEqual(uniqueFormPanels);
        expect(schema).toEqual(uniqueSchema);
    });
});
