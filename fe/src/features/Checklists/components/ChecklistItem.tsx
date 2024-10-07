import React, {ChangeEvent, KeyboardEvent, useEffect, useRef, useState} from "react";
import {Box, Typography} from "@mui/joy";
import {ChecklistItemData} from "../types";
import InlineInput from "../../../components/InlineInput";

type ChecklistItemComponentType = React.FC<{
    checklistItem?: ChecklistItemData,
    onUpdate?: (updated: ChecklistItemData) => void;
}>;

const ChecklistItem: ChecklistItemComponentType = ({checklistItem}) => {
    const noteInputRef = useRef<HTMLInputElement | null>(null);
    const [itemState, setItemState] = useState(checklistItem || {note: ""});
    const [editMode, setEditMode] = useState(false);

    useEffect(() => {
        if (editMode) {
            noteInputRef.current?.focus();
        }
    }, [editMode]);

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        setItemState((prev) => ({...prev, note: e.target.value}));
    }

    const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
        if (!(e.metaKey || e.ctrlKey || e.altKey || e.shiftKey)) {
            if (e.code === "Enter" || e.code === "Escape") {
                e.preventDefault();
                noteInputRef.current?.blur();
            }
        }
    }

    return (
        <Box
            sx={(theme) => ({
                display: "flex",
                alignItems: "center",
                borderRadius: "3rem",
                border: `2px dashed ${theme.palette.neutral.outlinedBorder}`,
                minWidth: "300px",
                py: 0.5,
                px: 2,
            })}>
            <Box sx={{flexGrow: 1}}>
                {editMode
                    ? (
                        <InlineInput
                            value={itemState.note}
                            onChange={handleChange}
                            onBlur={() => setEditMode(false)}
                            onKeyDown={handleKeyDown}
                            inputRef={noteInputRef}
                            placeholder="Type what to do"
                            size="lg"/>
                    ) : (
                        <Typography
                            onClick={() => setEditMode(true)}
                            level="body-lg"
                            noWrap>
                            {itemState.note || "Click here to add a new item."}
                        </Typography>
                    )}
            </Box>
        </Box>
    );
}

export default ChecklistItem;
