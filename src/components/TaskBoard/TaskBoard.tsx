"use client";

import { useState, useMemo, Dispatch, SetStateAction, useRef } from "react";
import {
    useSensors,
    useSensor,
    PointerSensor,
    KeyboardSensor,
    DndContext,
    closestCorners,
    DragEndEvent,
    DragStartEvent,
    DragOverEvent,
    DragOverlay,
    defaultDropAnimation,
} from "@dnd-kit/core";
import { arrayMove, sortableKeyboardCoordinates } from "@dnd-kit/sortable";
import { debounce } from "lodash";
import Container from "@/components/Container";
import TaskBoardSection from "@/components/TaskBoardSection";
import { TaskBoardSectionProps } from "@/components/TaskBoardSection/TaskBoardSection";

interface TaskBoardProps {
    boardSections: TaskBoardSectionProps[];
    setBoardSections: Dispatch<SetStateAction<TaskBoardSectionProps[]>>;
    anchoredErrorCallback?: () => void;
}

const TaskBoard = ({
    boardSections,
    setBoardSections,
    anchoredErrorCallback,
}: TaskBoardProps) => {
    const [activeTaskId, setActiveTaskId] = useState<null | string>(null);

    const activeTask = useMemo(
        () =>
            activeTaskId
                ? boardSections
                      .flatMap(section => section.tasks)
                      .find(task => task.id === activeTaskId)
                : null,
        [activeTaskId, boardSections]
    );

    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: {
                distance: 8,
            },
        }),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    );

    const handleDragStart = ({ active }: DragStartEvent) => {
        setActiveTaskId(active.id as string);
    };

    const findBoardSectionContainer = (
        boardSections: TaskBoardSectionProps[],
        id: string
    ) => {
        // note: this code could be nasty if a task.id and board.id were shared
        //      ok, ignore this for now
        if (boardSections.flatMap(section => section.id).includes(id)) {
            return boardSections.find(section => section.id === id);
        }
        return boardSections.find(s => s.tasks.some(task => task.id === id));
    };

    const debouncedUpdate = useRef(
        debounce(
            (
                activeSection: TaskBoardSectionProps,
                overSection: TaskBoardSectionProps,
                activeId: string,
                overId: string | null
            ) => {
                setBoardSections(prevBoardSections => {
                    // Copy the previous board sections to avoid direct mutations
                    const activeSectionIndex = prevBoardSections.findIndex(
                        section => section.id === activeSection.id
                    );
                    const overSectionIndex = prevBoardSections.findIndex(
                        section => section.id === overSection.id
                    );

                    // Copy the sections to avoid direct mutations
                    const newActiveSection = {
                        ...prevBoardSections[activeSectionIndex],
                        tasks: [...prevBoardSections[activeSectionIndex].tasks],
                    };
                    const newOverSection = {
                        ...prevBoardSections[overSectionIndex],
                        tasks: [...prevBoardSections[overSectionIndex].tasks],
                    };

                    // Find the indexes for the tasks
                    const activeIndex = newActiveSection.tasks.findIndex(
                        task => task.id === activeId
                    );
                    const overIndex = newOverSection.tasks.findIndex(
                        task => task.id !== overId
                    );

                    // Remove the active task from its original location
                    const [activeTask] = newActiveSection.tasks.splice(
                        activeIndex,
                        1
                    );

                    // Insert the active task into the new location
                    newOverSection.tasks.splice(overIndex, 0, activeTask);

                    // Create a new array of sections with the updated sections
                    const updatedBoardSections = [...prevBoardSections];
                    updatedBoardSections[activeSectionIndex] = newActiveSection;
                    updatedBoardSections[overSectionIndex] = newOverSection;

                    return updatedBoardSections;
                });
            },
            50
        )
    ).current;

    const handleDragOver = ({ active, over }: DragOverEvent) => {
        // Find the containers
        const activeSection = findBoardSectionContainer(
            boardSections,
            active.id as string
        );

        const overSection = findBoardSectionContainer(
            boardSections,
            over?.id as string
        );

        if (
            !activeSection ||
            !overSection ||
            activeSection.id === overSection.id
        ) {
            return;
        }

        if (activeTask?.anchored && anchoredErrorCallback) {
            anchoredErrorCallback();
            return;
        }

        debouncedUpdate(
            activeSection,
            overSection,
            active.id as string,
            (over?.id as string) ?? null
        );
    };

    const handleDragEnd = ({ active, over }: DragEndEvent) => {
        const activeSection = findBoardSectionContainer(
            boardSections,
            active.id as string
        );
        const overSection = findBoardSectionContainer(
            boardSections,
            over?.id as string
        );

        if (!activeSection || !overSection || activeSection !== overSection) {
            return;
        }

        const activeIndex = activeSection.tasks.findIndex(
            task => task.id === active.id
        );
        const overIndex = overSection.tasks.findIndex(
            task => task.id === over?.id
        );

        if (activeIndex !== overIndex) {
            setBoardSections(prevBoardSections => {
                const updatedBoardSections = prevBoardSections.map(section => {
                    if (section.id === activeSection.id) {
                        const newTasks = arrayMove(
                            section.tasks,
                            activeIndex,
                            overIndex
                        ).map((task, index) => {
                            const newTask = { ...task };

                            if (
                                task.id === active.id &&
                                newTask.task?.boardId
                            ) {
                                newTask.task.boardId = activeSection.id;
                            }

                            if (newTask.task) {
                                newTask.task.order = index + 1;
                            }

                            return newTask;
                        });

                        return {
                            ...section,
                            tasks: newTasks,
                        };
                    }
                    return section;
                });

                return updatedBoardSections;
            });
        }
    };

    return (
        <DndContext
            sensors={sensors}
            collisionDetection={closestCorners}
            onDragStart={handleDragStart}
            onDragOver={handleDragOver}
            onDragEnd={handleDragEnd}>
            <Container
                maxWidth={false}
                sx={{
                    p: 0,
                    m: 0,
                    display: "grid",
                    gridTemplateColumns: "2fr 2fr",
                    gap: 1,
                    pt: 2,
                }}>
                {boardSections.map(section => (
                    <TaskBoardSection key={section.id} {...section} />
                ))}

                <DragOverlay dropAnimation={defaultDropAnimation}>
                    {activeTask ? activeTask.content : null}
                </DragOverlay>
            </Container>
        </DndContext>
    );
};

export default TaskBoard;
