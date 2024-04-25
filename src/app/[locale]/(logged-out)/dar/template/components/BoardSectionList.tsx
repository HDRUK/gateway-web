"use client";

import React, { useState } from "react";
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
import Grid from "@mui/material/Grid";
import Container from "@/components/Container";
import Paper from "@/components/Paper";
import { findBoardSectionContainer, initializeBoard } from "../utils/board";
import { getTaskById } from "../utils/tasks";
import BoardSection from "./BoardSection";
import TaskItem from "./TaskItem";
import { BoardSections as BoardSectionsType, Task } from "./index";

const BoardSectionList = ({ tasks }: { tasks: Task[] }) => {
    const initialBoardSections = initializeBoard(tasks);
    const [boardSections, setBoardSections] =
        useState<BoardSectionsType>(initialBoardSections);

    const [activeTaskId, setActiveTaskId] = useState<null | string>(null);

    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    );

    const handleDragStart = ({ active }: DragStartEvent) => {
        setActiveTaskId(active.id as string);
    };

    const handleDragOver = ({ active, over }: DragOverEvent) => {
        // Find the containers
        const activeContainer = findBoardSectionContainer(
            boardSections,
            active.id as string
        );
        const overContainer = findBoardSectionContainer(
            boardSections,
            over?.id as string
        );

        if (
            !activeContainer ||
            !overContainer ||
            activeContainer === overContainer
        ) {
            return;
        }

        setBoardSections(boardSection => {
            const activeItems = boardSection[activeContainer];
            const overItems = boardSection[overContainer];

            // Find the indexes for the items
            const activeIndex = activeItems.findIndex(
                item => item.id === active.id
            );
            const overIndex = overItems.findIndex(item => item.id !== over?.id);

            return {
                ...boardSection,
                [activeContainer]: [
                    ...boardSection[activeContainer].filter(
                        item => item.id !== active.id
                    ),
                ],
                [overContainer]: [
                    ...boardSection[overContainer].slice(0, overIndex),
                    boardSections[activeContainer][activeIndex],
                    ...boardSection[overContainer].slice(
                        overIndex,
                        boardSection[overContainer].length
                    ),
                ],
            };
        });
    };

    const handleDragEnd = ({ active, over }: DragEndEvent) => {
        const activeContainer = findBoardSectionContainer(
            boardSections,
            active.id as string
        );
        const overContainer = findBoardSectionContainer(
            boardSections,
            over?.id as string
        );

        if (
            !activeContainer ||
            !overContainer ||
            activeContainer !== overContainer
        ) {
            return;
        }

        const activeIndex = boardSections[activeContainer].findIndex(
            task => task.id === active.id
        );
        const overIndex = boardSections[overContainer].findIndex(
            task => task.id === over?.id
        );

        if (activeIndex !== overIndex) {
            setBoardSections(boardSection => ({
                ...boardSection,
                [overContainer]: arrayMove(
                    boardSection[overContainer],
                    activeIndex,
                    overIndex
                ),
            }));
        }

        setActiveTaskId(null);
    };

    const dropAnimation: DropAnimation = {
        ...defaultDropAnimation,
    };

    const task = activeTaskId ? getTaskById(tasks, activeTaskId) : null;

    return (
        <DndContext
            sensors={sensors}
            collisionDetection={closestCorners}
            onDragStart={handleDragStart}
            onDragOver={handleDragOver}
            onDragEnd={handleDragEnd}>
            <Container maxWidth={false} sx={{ height: "1000px" }}>
                <h2> Edit a template </h2>
                <Container
                    maxWidth={false}
                    sx={{
                        display: "grid",
                        gridTemplateColumns: "1fr 2fr 2fr",
                        gap: 1,
                        pt: 2,
                        //height: "1000px",
                    }}>
                    <Paper sx={{ mx: 1, px: 2 }}>
                        {" "}
                        <h2> Sections </h2>
                    </Paper>

                    <Paper sx={{ mx: 1, px: 2 }}>
                        <BoardSection
                            id={"Selected Questions"}
                            description={
                                "Currently selected questions for your DAR template."
                            }
                            title={"Selected Questions"}
                            tasks={boardSections["Selected Questions"]}
                        />
                    </Paper>

                    <Paper sx={{ mx: 1, px: 2 }}>
                        <BoardSection
                            id={"Question Bank"}
                            description={
                                "Other available questions you can add from the question bank."
                            }
                            title={"Question Bank"}
                            tasks={boardSections["Question Bank"]}
                        />
                    </Paper>
                </Container>
                <DragOverlay dropAnimation={dropAnimation}>
                    {task ? <TaskItem task={task} /> : null}
                </DragOverlay>
            </Container>
        </DndContext>
    );

    return (
        <Container>
            <DndContext
                sensors={sensors}
                collisionDetection={closestCorners}
                onDragStart={handleDragStart}
                onDragOver={handleDragOver}
                onDragEnd={handleDragEnd}>
                <Grid container spacing={4}>
                    {Object.keys(boardSections).map(boardSectionKey => (
                        <Grid item xs={4} key={boardSectionKey}>
                            <BoardSection
                                id={boardSectionKey}
                                title={boardSectionKey}
                                tasks={boardSections[boardSectionKey]}
                            />
                        </Grid>
                    ))}
                    <DragOverlay dropAnimation={dropAnimation}>
                        {task ? <TaskItem task={task} /> : null}
                    </DragOverlay>
                </Grid>
            </DndContext>
        </Container>
    );
};

export default BoardSectionList;
