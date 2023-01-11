import * as dataSetHelperUtils from './DataSetHelper.util';

describe('Given the dataset inReview util', () => {
    describe('When it is not inReview', () => {
        it('Then returns false', () => {
            expect(
                dataSetHelperUtils.isInReview({
                    activeflag: 'rejected',
                })
            ).toBe(false);
        });
    });

    describe('When it is inReview', () => {
        it('Then returns true', () => {
            expect(
                dataSetHelperUtils.isInReview({
                    activeflag: 'inReview',
                })
            ).toBe(true);
        });
    });
});

describe('Given the dataset isDraft util', () => {
    describe('When it is not isDraft', () => {
        it('Then returns false', () => {
            expect(
                dataSetHelperUtils.isDraft({
                    activeflag: 'rejected',
                })
            ).toBe(false);
        });
    });

    describe('When it is isDraft', () => {
        it('Then returns true', () => {
            expect(
                dataSetHelperUtils.isDraft({
                    activeflag: 'draft',
                })
            ).toBe(true);
        });
    });
});

describe('Given the dataset isRejected util', () => {
    describe('When it is not isRejected', () => {
        it('Then returns false', () => {
            expect(
                dataSetHelperUtils.isRejected({
                    activeflag: 'inReview',
                })
            ).toBe(false);
        });
    });

    describe('When it is isRejected', () => {
        it('Then returns true', () => {
            expect(
                dataSetHelperUtils.isRejected({
                    activeflag: 'rejected',
                })
            ).toBe(true);
        });
    });
});

describe('Given the dataset isArchived util', () => {
    describe('When it is not isArchived', () => {
        it('Then returns false', () => {
            expect(
                dataSetHelperUtils.isArchived({
                    activeflag: 'inReview',
                })
            ).toBe(false);
        });
    });

    describe('When it is isArchived', () => {
        it('Then returns true', () => {
            expect(
                dataSetHelperUtils.isArchived({
                    activeflag: 'archive',
                })
            ).toBe(true);
        });
    });
});

describe('Given the dataset isNotActive util', () => {
    describe('When it is not isNotActive', () => {
        it('Then returns false', () => {
            expect(
                dataSetHelperUtils.isNotActive({
                    activeflag: 'active',
                })
            ).toBe(false);
        });
    });

    describe('When it is isActive', () => {
        it('Then returns true', () => {
            expect(
                dataSetHelperUtils.isNotActive({
                    activeflag: 'inReview',
                })
            ).toBe(true);
        });
    });
});
