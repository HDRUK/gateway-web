import { render } from '@testing-library/react';
import React from 'react';
import UnpublishedQuestionIcon from './UnpublishedQuestionIcon';

let wrapper;

describe('Given the UnpublishedQuestionIcon component', () => {
    describe('When it is rendered', () => {
        beforeAll(() => {
            wrapper = render(
                <UnpublishedQuestionIcon
                    question={{
                        questionId: '2',
                        questionStatus: 2,
                    }}
                    unpublishedGuidance={['1']}
                />,
                {
                    wrapper: Providers,
                }
            );
        });

        describe('And the question does not exist and is locked', () => {
            it('Then does not show any content', async () => {
                expect(wrapper.container.firstChild).toBeFalsy();
            });
        });

        describe('And the question exists', () => {
            it('Then shows the editted icon', async () => {
                wrapper.rerender(
                    <UnpublishedQuestionIcon
                        question={{
                            questionId: '1',
                            questionStatus: 1,
                        }}
                        unpublishedGuidance={['1']}
                    />
                );

                expect(wrapper.getByTestId('edited')).toBeTruthy();
            });
        });

        describe('And the question does not exist and is not locked', () => {
            it('Then shows nothing', async () => {
                wrapper.rerender(
                    <UnpublishedQuestionIcon
                        question={{
                            questionId: '1',
                            questionStatus: 1,
                        }}
                        unpublishedGuidance={['2']}
                    />
                );

                expect(wrapper.getByTestId('unedited')).toBeTruthy();
            });
        });
    });
});
