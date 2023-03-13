import { render, screen } from '@testing-library/react';
import UnpublishedQuestionIcon from './UnpublishedQuestionIcon';
import '@testing-library/jest-dom/extend-expect';

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
            it('Then does show the unedited icon', async () => {
                expect(screen.getByTestId("unedited")).toBeInTheDocument();
            });
        });

        describe('And the question exists', () => {
            it('Then shows the edited icon', async () => {
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
