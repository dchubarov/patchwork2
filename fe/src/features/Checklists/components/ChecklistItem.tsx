import React, {ChangeEvent, KeyboardEvent, useRef, useState} from "react";
import {Box, IconButton, Typography} from "@mui/joy";
import {ChecklistItemState} from "../types";
import InlineInput from "../../../components/InlineInput";
import {
    Add as AddIcon,
    CheckBoxOutlineBlank as UncheckedIcon,
    CheckBoxOutlined as CheckedIcon
} from "@mui/icons-material";
import ColorLabel from "../../../components/ColorLabel";

type ChecklistItemComponentType = React.FC<{
    checklistItem?: ChecklistItemState,
    onUpdate?: (updated: ChecklistItemState) => void;
    defaultEdit?: boolean;
    placeholder?: string;
    busy?: boolean;
}>;

const ChecklistItem: ChecklistItemComponentType = ({checklistItem, onUpdate, defaultEdit, placeholder, busy}) => {
    const noteInputRef = useRef<HTMLInputElement | null>(null);
    const [editedItem, setEditedItem] = useState<ChecklistItemState>(checklistItem || {note: ""});
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

    const handleColorLabelChange = (value: string | undefined) => {
        setEditedItem((prev) => {
            const next: ChecklistItemState = {...prev, colorLabel: value === undefined ? null : value};
            if (!isNew && next.colorLabel !== editedItem.colorLabel) onUpdate?.(next);
            return next;
        })
    }

    const handleDoneToggle = () => {
        setEditedItem((prev) => {
            const next: ChecklistItemState = {...prev, done: !prev.done};
            onUpdate?.(next);
            return next;
        })
    }

    const bgColor = editedItem.colorLabel
        ? `var(--joy-palette-colorLabel-${editedItem.colorLabel}-100, --joy-palette-neutral-100)`
        : "background.body";

    const foreColor = editedItem.colorLabel
        ? `var(--joy-palette-colorLabel-${editedItem.colorLabel}-700, --joy-palette-neutral-700)`
        : "text.primary";

    const borderColor = editedItem.colorLabel
        ? `var(--joy-palette-colorLabel-${editedItem.colorLabel}-300, --joy-palette-neutral-300)`
        : "var(--joy-palette-neutral-300)";

    return (
        <Box
            sx={{
                display: "flex",
                alignItems: "center",
                borderRadius: "3rem",
                backgroundColor: bgColor,
                border: `2px ${isNew ? "dashed" : "solid"} ${borderColor}`,
                minWidth: "300px",
                gap: 0.5,
                py: 0.5,
                px: 1,
            }}>

            <IconButton
                loading={busy}
                disabled={isNew}
                onClick={handleDoneToggle}
                size="sm"
                sx={{
                    borderRadius: "50%",
                    "&:hover": {
                        backgroundColor: bgColor
                    }
                }}>

                {editedItem.id
                    ? editedItem.done ? <CheckedIcon sx={{color: foreColor}}/> : <UncheckedIcon sx={{color: foreColor}}/>
                    : <AddIcon/>}
            </IconButton>

            {editMode
                ? (
                    <InlineInput
                        autoFocus
                        autoComplete="off"
                        name={`note-input-${checklistItem?.id || "new"}`}
                        value={editedItem.note}
                        disabled={busy}
                        onChange={handleNoteInputChange}
                        onKeyDown={handleNoteInputKeyDown}
                        onBlur={() => noteEdited()}
                        inputRef={noteInputRef}
                        placeholder="Type what to do"
                        size="lg"
                        sx={{
                            flexGrow: 1,
                            color: foreColor,
                            "&:hover": {
                                color: foreColor
                            }
                        }}/>
                ) : (
                    <Typography
                        onClick={() => setEditMode(true)}
                        level="body-lg"
                        noWrap
                        sx={{
                            fontStyle: editedItem.note === "" ? "italic" : "initial",
                            textDecoration: editedItem.done ? "line-through" : "initial",
                            color: foreColor,
                            flexGrow: 1,
                        }}>
                        {editedItem.note || placeholder}
                    </Typography>
                )}

            <ColorLabel.Selector
                showNoColor
                selectedLabel={editedItem.colorLabel}
                onChange={handleColorLabelChange}
                sx={{
                    borderRadius: "50%",
                    "&:hover": {
                        backgroundColor: bgColor
                    }
                }}/>
        </Box>
    );
}

export default ChecklistItem;
