import React from 'react';
import { render, screen, cleanup, waitFor, act, fireEvent } from 'testUtils';
import RelatedResourcesTab from './RelatedResourcesTab';
import '@testing-library/jest-dom/extend-expect';
import { server } from '../../services/mockServer';
import { getRelatedObjectV1, generateMockRelatedObjectV1 } from '../../../test/handlers';
import { generateMockUuid } from '../../../test/mocks/generateData';

describe('RelatedResourcesTab', () => {
    beforeAll(() => {
        server.listen();
    });

    afterEach(() => {
        server.resetHandlers();
        cleanup();
    });

    afterAll(() => {
        server.close();
    });

    it('should render "No related resources found" when none are passed in', async () => {
        act(() => {
            render(<RelatedResourcesTab relatedObjects={[]} authorId={76482376438726} />);
        });
        await waitFor(() => {
            expect(screen.getByText('No related resources found')).toBeInTheDocument();
        });
    });

    it('should render "active" related resource', async () => {
        const uuid = generateMockUuid();
        const mockRelatedObjectV1 = generateMockRelatedObjectV1({ id: uuid, activeflag: 'active', type: 'tool' });
        const mockRelatedObjects = [
            {
                objectId: uuid,
                objectType: 'tool',
            },
        ];
        server.use(getRelatedObjectV1(mockRelatedObjectV1));
        act(() => {
            render(<RelatedResourcesTab relatedObjects={mockRelatedObjects} authorId={mockRelatedObjectV1.authors[0]} />);
        });
        await waitFor(() => {
            expect(screen.getByText(mockRelatedObjectV1.name)).toBeInTheDocument();
        });
    });

    it('should not render "rejected" related resource', async () => {
        const uuid = generateMockUuid();
        const mockRelatedObjectV1 = generateMockRelatedObjectV1({ id: uuid, activeflag: 'rejected', type: 'tool' });
        const mockRelatedObjects = [
            {
                objectId: uuid,
                objectType: 'tool',
            },
        ];
        server.use(getRelatedObjectV1(mockRelatedObjectV1));
        act(() => {
            render(<RelatedResourcesTab relatedObjects={mockRelatedObjects} authorId={mockRelatedObjectV1.authors[0]} />);
        });
        await waitFor(() => {
            expect(screen.getByText('No related resources found')).toBeInTheDocument();
        });
    });

    it('should render "review" related resource when author id matches', async () => {
        const uuid = generateMockUuid();
        const mockRelatedObjectV1 = generateMockRelatedObjectV1({ id: uuid, activeflag: 'review', type: 'tool' });
        const mockRelatedObjects = [
            {
                objectId: uuid,
                objectType: 'tool',
            },
        ];
        server.use(getRelatedObjectV1(mockRelatedObjectV1));
        act(() => {
            render(<RelatedResourcesTab relatedObjects={mockRelatedObjects} authorId={mockRelatedObjectV1.authors[0]} />);
        });
        await waitFor(() => {
            expect(screen.getByText(mockRelatedObjectV1.name)).toBeInTheDocument();
        });
    });

    it('should not render "review" related resource if author id does not match', async () => {
        const uuid = generateMockUuid();
        const mockRelatedObjectV1 = generateMockRelatedObjectV1({ id: uuid, activeflag: 'review', type: 'tool' });
        const mockRelatedObjects = [
            {
                objectId: uuid,
                objectType: 'tool',
            },
        ];
        server.use(getRelatedObjectV1(mockRelatedObjectV1));
        act(() => {
            render(<RelatedResourcesTab relatedObjects={mockRelatedObjects} authorId={76482376438726} />);
        });
        await waitFor(() => {
            expect(screen.queryByText(mockRelatedObjectV1.name)).not.toBeInTheDocument();
        });
    });

    describe('Filter by type', () => {
        let mockRelatedObjects = [];
        let mockRelatedObjectV1;
        let mockRelatedObjectV2;
        let mockRelatedObjectV3;

        beforeEach(() => {
            const uuid1 = generateMockUuid();
            const uuid2 = generateMockUuid();
            const uuid3 = generateMockUuid();

            mockRelatedObjectV1 = generateMockRelatedObjectV1({ id: uuid1, activeflag: 'active', type: 'tool' });
            mockRelatedObjectV2 = generateMockRelatedObjectV1({ id: uuid2, activeflag: 'active', type: 'dataUseRegister' });
            mockRelatedObjectV3 = generateMockRelatedObjectV1({ id: uuid3, activeflag: 'active', type: 'tool' });

            mockRelatedObjects = [
                {
                    objectId: uuid1,
                    objectType: 'tool',
                },
                {
                    objectId: uuid2,
                    objectType: 'dataUseRegister',
                },
                {
                    objectId: uuid3,
                    objectType: 'tool',
                },
            ];
            server.use(getRelatedObjectV1(mockRelatedObjectV1));
            server.use(getRelatedObjectV1(mockRelatedObjectV2));
            server.use(getRelatedObjectV1(mockRelatedObjectV3));
        });
        it('should display count of each type within dropdown when expanded', async () => {
            act(() => {
                render(<RelatedResourcesTab relatedObjects={mockRelatedObjects} authorId={76482376438726} />);
            });

            await waitFor(() => {
                expect(screen.getByText('Show all resources (3)')).toBeInTheDocument();
            });

            act(() => {
                screen.getByText('Show all resources (3)').click();
            });

            expect(screen.getByText('Show data uses (1)')).toBeInTheDocument();
            expect(screen.getByText('Show tools (2)')).toBeInTheDocument();
        });
        it('should filter related resources by type', async () => {
            act(() => {
                render(<RelatedResourcesTab relatedObjects={mockRelatedObjects} authorId={76482376438726} />);
            });

            await waitFor(() => {
                expect(screen.getByText('Show all resources (3)')).toBeInTheDocument();
            });

            act(() => {
                screen.getByText('Show all resources (3)').click();
            });

            expect(screen.getAllByText('Show data uses (1)')).toHaveLength(1);
            expect(screen.getAllByText('Data use')).toHaveLength(1);
            expect(screen.getAllByText('Tool')).toHaveLength(2);

            act(() => {
                screen.getByText('Show data uses (1)').click();
            });

            expect(screen.getAllByText('Show data uses (1)')).toHaveLength(2);
            expect(screen.getAllByText('Data use')).toHaveLength(1);
            expect(screen.queryAllByText('Tool')).toHaveLength(0);
        });
    });

    it('should filter related resources by search value', async () => {
        let wrapper;
        const uuid = generateMockUuid();
        const mockRelatedObjectV1 = generateMockRelatedObjectV1({ id: uuid, activeflag: 'active', type: 'tool' });
        const mockRelatedObjects = [
            {
                objectId: uuid,
                objectType: 'tool',
            },
        ];
        server.use(getRelatedObjectV1(mockRelatedObjectV1));

        act(() => {
            wrapper = render(<RelatedResourcesTab relatedObjects={mockRelatedObjects} authorId={76482376438726} />);
        });

        await waitFor(() => {
            expect(screen.getByText('Tool')).toBeInTheDocument();
            expect(screen.getByText('Show all resources (1)')).toBeInTheDocument();
        });

        const input = wrapper.container.querySelector('input');

        act(() => {
            fireEvent.change(input, { target: { value: 'value not in name' } });
            fireEvent.keyDown(input, { key: 'Enter', code: 'Enter', charCode: 13 });
        });

        await waitFor(() => {
            expect(screen.getByText('Show all resources (0)')).toBeInTheDocument();
        });
    });
});
