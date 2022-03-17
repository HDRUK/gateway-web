import { isEditMode } from '../GeneralHelper.util';

describe('Test GeneralHelper Utility', () => {
    it('should test isEditMode fn valid url', () => {
        const validSrc = '/projects/edit/456765';
        const isEdit = isEditMode(validSrc);

        expect(isEdit).toBe(true);
    });

    it('should test isEditMode fn inValid url', () => {
        const invalidSrc = '/projects/465465';
        const isEdit = isEditMode(invalidSrc);

        expect(isEdit).toBe(false);
    });
});
