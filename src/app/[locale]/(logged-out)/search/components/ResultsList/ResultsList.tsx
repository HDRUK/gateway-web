import {
    type ReactNode,
    Children,
    useEffect,
    useMemo,
    useRef,
    useState,
} from "react";
import { Box, List, useMediaQuery, useTheme } from "@mui/material";
import BoxContainer from "@/components/BoxContainer";

export interface ResultsListProps {
    children: ReactNode;
    variant?: "list" | "tiled";
    minTileWidth?: number;
    maxDesktopColumns?: number;
    fillDanglingSingleCard?: boolean;
}

export default function ResultsList({
    variant = "list",
    minTileWidth = 250,
    maxDesktopColumns,
    fillDanglingSingleCard = false,
    children,
}: ResultsListProps) {
    const theme = useTheme();
    const isDesktop = useMediaQuery(theme.breakpoints.up("desktop"));
    const containerRef = useRef<HTMLDivElement>(null);
    const [containerWidth, setContainerWidth] = useState(0);
    const tiledChildren = useMemo(() => Children.toArray(children), [children]);

    useEffect(() => {
        if (variant !== "tiled" || !fillDanglingSingleCard || !containerRef.current) {
            return undefined;
        }

        const observer = new ResizeObserver(entries => {
            const nextWidth = entries[0]?.contentRect?.width ?? 0;
            setContainerWidth(nextWidth);
        });

        observer.observe(containerRef.current);
        return () => observer.disconnect();
    }, [variant, fillDanglingSingleCard]);

    const blankTileCount = useMemo(() => {
        if (variant !== "tiled" || !fillDanglingSingleCard || !tiledChildren.length) {
            return 0;
        }

        if (containerWidth <= 0) {
            return 0;
        }

        const gapPx = Number(theme.spacing(2).replace("px", ""));
        const autoFitColumns = Math.max(
            1,
            Math.floor((containerWidth + gapPx) / (minTileWidth + gapPx))
        );
        const currentColumns =
            isDesktop && maxDesktopColumns
                ? maxDesktopColumns
                : autoFitColumns;
        const remainder = tiledChildren.length % currentColumns;

        return remainder === 1 && currentColumns > 1 ? currentColumns - 1 : 0;
    }, [
        variant,
        fillDanglingSingleCard,
        tiledChildren.length,
        containerWidth,
        theme,
        minTileWidth,
        isDesktop,
        maxDesktopColumns,
    ]);

    return variant === "list" ? (
        <List
            sx={{
                width: "100%",
                bgcolor: "background.paper",
                mb: 2,
                pb: 2,
            }}>
            {children}
        </List>
    ) : (
        <BoxContainer
            ref={containerRef}
            sx={{
                gridTemplateColumns: {
                    mobile: "repeat(1, minmax(0, 1fr))",
                    tablet: `repeat(auto-fit, minmax(${minTileWidth}px, 1fr))`,
                    ...(maxDesktopColumns && {
                        desktop: `repeat(${maxDesktopColumns}, minmax(0, 1fr))`,
                    }),
                },
                gap: 2,
                mb: 2,
            }}>
            {tiledChildren}
            {Array.from({ length: blankTileCount }, (_, index) => (
                <Box
                    key={`blank-tile-${index}`}
                    aria-hidden
                    sx={{
                        minHeight: 130,
                        border: `1px dashed ${theme.palette.grey[400]}`,
                        bgcolor: "grey.100",
                    }}
                />
            ))}
        </BoxContainer>
    );
}
