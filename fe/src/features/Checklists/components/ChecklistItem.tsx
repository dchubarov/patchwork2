import React, {ChangeEvent, KeyboardEvent, useRef, useState} from "react";
import {Box, CircularProgress, Typography} from "@mui/joy";
import {ChecklistItemData} from "../types";
import InlineInput from "../../../components/InlineInput";
import {Add as AddIcon, RadioButtonUnchecked as UncheckedIcon, TaskAlt as CheckedIcon} from "@mui/icons-material";

type ChecklistItemComponentType = React.FC<{
    checklistItem?: ChecklistItemData,
    onUpdate?: (updated: ChecklistItemData) => void;
    defaultEdit?: boolean
    busy?: boolean;
}>;

const ChecklistItem: ChecklistItemComponentType = ({checklistItem, onUpdate, defaultEdit, busy}) => {
    const noteInputRef = useRef<HTMLInputElement | null>(null);
    const [editedItem, setEditedItem] = useState(checklistItem || {note: ""});
    const [editMode, setEditMode] = useState(defaultEdit || false);
    const isNew = !checklistItem?.id

    const handleNoteInputChange = (e: ChangeEvent<HTMLInputElement>) => {
        setEditedItem((prev) => ({...prev, note: e.target.value}));
    }

    const handleNoteInputKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
        if ((e.code === "Enter" || e.code === "Escape") && !(e.metaKey || e.ctrlKey || e.altKey || e.shiftKey)) {
            e.preventDefault();
            noteEdited(e.code === "Escape");
        }
    }

    const noteEdited = (cancelled?: boolean) => {
        if (!cancelled && editedItem.note !== (checklistItem?.note || "")) {
            onUpdate?.(editedItem);
        }
        if (cancelled || !checklistItem?.id) {
            setEditedItem(checklistItem || {note: ""});
        }
        setEditMode(false);
    }

    return (
        <Box
            sx={{
                display: "flex",
                alignItems: "center",
                borderRadius: "3rem",
                border: `2px ${isNew ? "dashed" : "solid"} var(--joy-palette-neutral-300)`,
                minWidth: "300px",
                gap: 0.5,
                py: 0.5,
                px: 1,
            }}>

            {busy ? <CircularProgress color="neutral" variant="soft" size="sm" thickness={2}/> :
                (checklistItem?.id
                    ? (checklistItem?.done ? <CheckedIcon/> : <UncheckedIcon/>)
                    : <AddIcon sx={{color: "var(--joy-palette-neutral-300)"}}/>)}

            <Box sx={{flexGrow: 1}}>
                {editMode
                    ? (
                        <InlineInput
                            autoFocus
                            autoComplete="off"
                            name={`note-input-${checklistItem?.id || "new"}`}
                            value={editedItem.note}
                            onChange={handleNoteInputChange}
                            onKeyDown={handleNoteInputKeyDown}
                            onBlur={() => noteEdited()}
                            inputRef={noteInputRef}
                            placeholder="Type what to do"
                            size="lg"/>
                    ) : (
                        <Typography
                            onClick={() => setEditMode(true)}
                            level="body-lg"
                            noWrap>
                            {editedItem.note || (isNew ? "Click here to add a new item" : "No content")}
                        </Typography>
                    )}
            </Box>
        </Box>
    );
}

export default ChecklistItem;
