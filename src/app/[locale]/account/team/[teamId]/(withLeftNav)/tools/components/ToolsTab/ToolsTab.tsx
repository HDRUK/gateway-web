import { Control } from "react-hook-form";
import { Tool } from "@/interfaces/Tool";
import { IconType } from "@/interfaces/Ui";
import Box from "@/components/Box";
import BoxContainer from "@/components/BoxContainer";
import InputWrapper from "@/components/InputWrapper";
import Pagination from "@/components/Pagination";
import Paper from "@/components/Paper";
import ShowingXofX from "@/components/ShowingXofX";
import ToolCard from "@/components/ToolCard";
import {
    searchFilter,
    sortField,
    toggleDirection,
} from "@/config/forms/toolAccountSearch";

interface ToolsTabProps {
    list?: Tool[];
    actions: {
        icon: IconType;
        href?: string;
        action?: (id: number) => void;
        label: string;
    }[];
    lastPage?: number;
    from?: number;
    to?: number;
    control: Control;
    total?: number;
    label: string;
    currentPage: number;
    setValue: (name: string, value: unknown) => void;
    setCurrentPage: (page: number) => void;
    isLoading: boolean;
}

const ToolsTab = ({
    actions,
    list,
    label,
    lastPage,
    from,
    to,
    total,
    currentPage,
    setCurrentPage,
    control,
    setValue,
    isLoading,
}: ToolsTabProps) => {
    return (
        <Box sx={{ p: 0 }}>
            <BoxContainer
                sx={{
                    my: 2,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                }}>
                <Box sx={{ p: 0, width: "50%" }}>
                    <InputWrapper
                        setValue={setValue}
                        control={control}
                        {...searchFilter}
                    />
                </Box>
                <BoxContainer
                    sx={{
                        display: "flex",
                        alignItems: "center",
                    }}>
                    <Box sx={{ p: 0 }}>
                        <InputWrapper control={control} {...sortField} />
                    </Box>
                    <Box sx={{ p: 0 }}>
                        <InputWrapper control={control} {...toggleDirection} />
                    </Box>
                </BoxContainer>
            </BoxContainer>

            <Box
                sx={{
                    p: 0,
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                }}>
                <ShowingXofX from={from} to={to} total={total} />
            </Box>

            {(list || [])
                .map(tool => (
                    <ToolCard actions={actions} key={tool.id} tool={tool} />
                ))
                .filter(tool => !!tool)}
            {list?.length === 0 && (
                <Paper sx={{ p: 2, mb: 2 }}>
                    No {label.toLowerCase()} tools found.
                </Paper>
            )}
            <Pagination
                isLoading={isLoading}
                page={currentPage}
                count={lastPage}
                onChange={(e: React.ChangeEvent<unknown>, page: number) =>
                    setCurrentPage(page)
                }
            />
        </Box>
    );
};

export default ToolsTab;
