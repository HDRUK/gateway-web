"use client";

import { useEffect, useRef, useState } from "react";
import Fade from "@mui/material/Fade";
import LinearProgress from "@mui/material/LinearProgress";
import {
    PROGRESS_END_EVENT,
    PROGRESS_START_EVENT,
    ROUTER_PROGRESS_SOURCE,
} from "@/consts/navigation";
import { Wrapper } from "./NavigationProgress.styles";

const SHOW_DELAY = 150;
const TRICKLE_INTERVAL = 300;
const START_PROGRESS = 30;
const MAX_PROGRESS = 90;
const COMPLETE_DURATION = 400;
const ROUTER_TIMEOUT = 10000;

const getSource = (event: Event) => (event as CustomEvent<string>).detail;

const NavigationProgress = () => {
    const [isVisible, setIsVisible] = useState(false);
    const [progress, setProgress] = useState(0);
    const [run, setRun] = useState(0);
    const showTimer = useRef<ReturnType<typeof setTimeout>>();
    const trickleTimer = useRef<ReturnType<typeof setInterval>>();
    const hideTimer = useRef<ReturnType<typeof setTimeout>>();
    const routerTimer = useRef<ReturnType<typeof setTimeout>>();
    const pendingSources = useRef(new Set<string>());

    useEffect(() => {
        const sources = pendingSources.current;

        const clearTimers = () => {
            clearTimeout(showTimer.current);
            clearInterval(trickleTimer.current);
            clearTimeout(hideTimer.current);
            clearTimeout(routerTimer.current);
        };

        const complete = () => {
            clearTimers();
            setProgress(current => (current > 0 ? 100 : 0));
            hideTimer.current = setTimeout(
                () => setIsVisible(false),
                COMPLETE_DURATION
            );
        };

        const endSource = (source: string) => {
            if (!sources.delete(source)) {
                return;
            }

            if (source === ROUTER_PROGRESS_SOURCE) {
                clearTimeout(routerTimer.current);
            }

            if (sources.size === 0) {
                complete();
            }
        };

        const handleStart = (event: Event) => {
            const source = getSource(event);
            const isIdle = sources.size === 0;
            sources.add(source);

            if (isIdle) {
                clearTimers();
                setIsVisible(false);

                showTimer.current = setTimeout(() => {
                    setRun(current => current + 1);
                    setProgress(START_PROGRESS);
                    setIsVisible(true);

                    trickleTimer.current = setInterval(() => {
                        setProgress(
                            current => current + (MAX_PROGRESS - current) / 10
                        );
                    }, TRICKLE_INTERVAL);
                }, SHOW_DELAY);
            }

            if (source === ROUTER_PROGRESS_SOURCE) {
                clearTimeout(routerTimer.current);
                routerTimer.current = setTimeout(
                    () => endSource(source),
                    ROUTER_TIMEOUT
                );
            }
        };

        const handleEnd = (event: Event) => {
            endSource(getSource(event));
        };

        window.addEventListener(PROGRESS_START_EVENT, handleStart);
        window.addEventListener(PROGRESS_END_EVENT, handleEnd);

        return () => {
            window.removeEventListener(PROGRESS_START_EVENT, handleStart);
            window.removeEventListener(PROGRESS_END_EVENT, handleEnd);
            clearTimers();
            sources.clear();
        };
    }, []);

    return (
        <Fade in={isVisible} onExited={() => setProgress(0)}>
            <Wrapper aria-hidden>
                <LinearProgress
                    key={run}
                    variant="determinate"
                    color="secondary"
                    value={progress}
                />
            </Wrapper>
        </Fade>
    );
};

export default NavigationProgress;
