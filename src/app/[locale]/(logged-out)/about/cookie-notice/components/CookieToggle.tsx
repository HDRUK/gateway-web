"use client";

import Button from "@/components/Button";

export default function CookieToggle() {
    return (
        <>
            <Button
                onClick={() => {
                    if (window.Optanon?.ToggleInfoDisplay) {
                        window.Optanon.ToggleInfoDisplay();
                    }
                }}>
                Cookie settings
            </Button>
        </>
    );
}
