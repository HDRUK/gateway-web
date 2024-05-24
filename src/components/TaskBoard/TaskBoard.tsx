"use client";

import React, {
    useState,
    useMemo,
    useEffect,
    Dispatch,
    SetStateAction,
} from "react";
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
    DropAnimation,
    defaultDropAnimation,
} from "@dnd-kit/core";
import { sortableKeyboardCoordinates, arrayMove } from "@dnd-kit/sortable";
import Box from "@/components/Box";
import Button from "@/components/Button";
import Container from "@/components/Container";
import Paper from "@/components/Paper";
import TaskBoardSection from "@/components/TaskBoardSection";
import { TaskBoardSectionProps } from "@/components/TaskBoardSection/TaskBoardSection";
import Typography from "@/components/Typography";
import usePatch from "@/hooks/usePatch";
import notificationService from "@/services/notification";
import apis from "@/config/apis";

//import { findBoardSectionContainer, initializeBoard } from "../utils/board";
//import { getTaskById } from "../utils/tasks";
//import QuestionItem from "./QuestionItem";
//import { BoardSections as BoardSectionsType, QuestionCard } from "./index";

interface TaskBoardProps {
    boardSections: TaskBoardSectionProps[];
    setBoardSections: Dispatch<SetStateAction<TaskBoardSectionProps[]>>;
    anchoredErrorCallback?: () => void;
}

const TaskBoard = ({
    boardSections,
    setBoardSections,
    anchoredErrorCallback = () => console.error("cannot move"),
}: TaskBoardProps) => {
    const [activeTaskId, setActiveTaskId] = useState<null | string>(null);

    const dropAnimation: DropAnimation = {
        ...defaultDropAnimation,
    };

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
        //note: this code could be nasty if a task.id and board.id were shared
        //      ok, ignore this for now
        if (boardSections.flatMap(section => section.id).includes(id)) {
            return boardSections.find(section => section.id === id);
        }
        return boardSections.find(s => s.tasks.some(task => task.id === id));
    };

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

        if (activeTask?.anchored) {
            anchoredErrorCallback();
            return;
        }

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
            };
            const newOverSection = {
                ...prevBoardSections[overSectionIndex],
            };

            // Copy the tasks arrays to avoid direct mutations
            newActiveSection.tasks = [...newActiveSection.tasks];
            newOverSection.tasks = [...newOverSection.tasks];

            // Find the indexes for the tasks
            const activeIndex = newActiveSection.tasks.findIndex(
                task => task.id === active.id
            );
            const overIndex = newOverSection.tasks.findIndex(
                task => task.id !== over?.id
            );

            // Remove the active task from its original location
            const [activeTask] = newActiveSection.tasks.splice(activeIndex, 1);

            // Insert the active task into the new location
            newOverSection.tasks.splice(overIndex, 0, activeTask);

            // Create a new array of sections with the updated sections
            const updatedBoardSections = [...prevBoardSections];
            updatedBoardSections[activeSectionIndex] = newActiveSection;
            updatedBoardSections[overSectionIndex] = newOverSection;

            return updatedBoardSections;
        });
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
                        );
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

    /*
    const handleSaveChanges = () => {
        const selectedQuestionIds = boardSections["Selected Questions"].map(
            s => s.id
        );
        const tasksInSection = tasks
            .filter(t => selectedQuestionIds.includes(t.id))
            .sort(
                (a, b) =>
                    selectedQuestionIds.indexOf(a.id) -
                    selectedQuestionIds.indexOf(b.id)
            );
        tasks = tasks.map(task => {
            let status = "";
            if (selectedQuestionIds.includes(task.id)) {
                status = "Selected Questions";
            } else {
                status = "Question Bank";
            }
            return { ...task, status: status };
        });
        const payload = { questions: tasksInSection };
        updateTemplateQuestions(templateId, payload);
        console.log(tasks);
    };*/

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
                    <Paper sx={{ mx: 1, px: 2 }}>
                        <TaskBoardSection
                            id={section.id}
                            title={section.title}
                            description={section.description}
                            tasks={section.tasks}
                        />
                    </Paper>
                ))}

                <DragOverlay dropAnimation={dropAnimation}>
                    {activeTask ? activeTask.content : null}
                </DragOverlay>
            </Container>

            {/*
            <Paper sx={{ m: 2, p: 2, mb: 5 }}>
                <Box
                    sx={{
                        p: 0,
                        display: "flex",
                        justifyContent: "end",
                    }}>
                    <Button onClick={handleSaveChanges} type="submit">
                        Save changes
                    </Button>
                </Box>
            </Paper>
                */}
        </DndContext>
    );
};

export default TaskBoard;
