import { mockInReviewDataset, mockRejectedDataset } from '../../services/datasets/mockMsw';
import utils from '../DataSetHelper.util';

describe('Given the dataset inReview util', () => {
    describe('When it is not inReview', () => {
        it('Then returns false', () => {
            expect(
                utils.isInReview({
                    activeflag: 'rejected',
                })
            ).toBe(false);
        });
    });

    describe('When it is inReview', () => {
        it('Then returns true', () => {
            expect(
                utils.isInReview({
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
                utils.isDraft({
                    activeflag: 'rejected',
                })
            ).toBe(false);
        });
    });

    describe('When it is isDraft', () => {
        it('Then returns true', () => {
            expect(
                utils.isDraft({
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
                utils.isRejected({
                    activeflag: 'inReview',
                })
            ).toBe(false);
        });
    });

    describe('When it is isRejected', () => {
        it('Then returns true', () => {
            expect(
                utils.isRejected({
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
                utils.isArchived({
                    activeflag: 'inReview',
                })
            ).toBe(false);
        });
    });

    describe('When it is isArchived', () => {
        it('Then returns true', () => {
            expect(
                utils.isArchived({
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
                utils.isNotActive({
                    activeflag: 'active',
                })
            ).toBe(false);
        });
    });

    describe('When it is isActive', () => {
        it('Then returns true', () => {
            expect(
                utils.isNotActive({
                    activeflag: 'inReview',
                })
            ).toBe(true);
        });
    });
});
