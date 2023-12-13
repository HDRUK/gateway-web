"use client";
import PerfectScrollbar from "react-perfect-scrollbar";
import "react-perfect-scrollbar/dist/css/styles.css";
import { ReactNode } from "react";

export type ScrollbarProps = {
    children: ReactNode;
    height?: string;
};

const Scrollbar = ({ children, height = "200px" }: ScrollbarProps) => {
    return (
        <div style={{ height: height }}>
            <PerfectScrollbar>
                <div className="content"> {children} </div>
            </PerfectScrollbar>
        </div>
    );
};

export default Scrollbar;
