import { formatPaperDescription, formatPaperIntro } from './Paper.util';

describe('Paper Util', () => {
    describe('formatPaperDescription', () => {
        it('should return formatted content', () => {
            const examplePaperWithAbstract =
                '\n\n**Lay Summary**\n\nAbstract <h4>Introduction</h4> Nulla cursus erat enim, ac efficitur velit molestie non. Suspendisse potenti. In porttitor non sem vitae pretium.';
            const examplePaper =
                '\n\n**Lay Summary**\n\n<h4>Introduction</h4> Nulla cursus erat enim, ac efficitur velit molestie non. Suspendisse potenti. In porttitor non sem vitae pretium.';

            const expectedResponse =
                '<h4>Introduction</h4> Nulla cursus erat enim, ac efficitur velit molestie non. Suspendisse potenti. In porttitor non sem vitae pretium.';

            expect(formatPaperDescription(examplePaperWithAbstract)).toEqual(expectedResponse);
            expect(formatPaperDescription(examplePaper)).toEqual(expectedResponse);
        });
        it('should not error if unexpected value is passed', () => {
            expect(formatPaperDescription('')).toEqual('');
            expect(formatPaperDescription(undefined)).toEqual('');
            expect(formatPaperDescription(2)).toEqual('');
            expect(formatPaperDescription([])).toEqual('');
        });
    });
    describe('formatPaperIntro', () => {
        it('should return formatted content', () => {
            const examplePaperWithAbstract =
                '\n\n**Lay Summary**\n\nAbstract <h4>Introduction</h4> Nulla cursus erat enim, ac efficitur velit molestie non. Suspendisse potenti. In porttitor non sem vitae pretium.';
            const examplePaper =
                '\n\n**Lay Summary**\n\n<h4>Introduction</h4> Nulla cursus erat enim, ac efficitur velit molestie non. Suspendisse potenti. In porttitor non sem vitae pretium.';

            const expectedResponse =
                'Nulla cursus erat enim, ac efficitur velit molestie non. Suspendisse potenti. In porttitor non sem vitae pretium.';

            expect(formatPaperIntro(examplePaperWithAbstract)).toEqual(expectedResponse);
            expect(formatPaperIntro(examplePaper)).toEqual(expectedResponse);
        });
        it('should not error if unexpected value is passed', () => {
            expect(formatPaperIntro('')).toEqual('');
            expect(formatPaperIntro(undefined)).toEqual('');
            expect(formatPaperIntro(2)).toEqual('');
            expect(formatPaperIntro([])).toEqual('');
        });
    });
});
