import React from "react";
import {ListItemContent} from "@mui/joy";
import {AddCircle as AddIcon} from "@mui/icons-material";
import Editable from "@/components/Editable";
import {useChecklist} from "../hooks";

const ChecklistPlaceholder: React.FC = () => {
    const {addOrUpdateItem} = useChecklist();
    const handleValueEdited = (editedValue?: string) => {
        if (editedValue && editedValue.trim()) {
            addOrUpdateItem({
                id: ''/*new*/,
                note: editedValue.trim(),
                parent: null,
                done: false,
                colorLabel: null,
                sequenceCode: 0,
            });
        }
        // always restore original (blank) value
        return false;
    }

    return (
        <ListItemContent sx={{display: "flex", gap: 1, alignItems: "center"}}>
            <AddIcon sx={{mx: "2px", color: "var(--joy-palette-neutral-400)"}}/>
            <Editable.Typography
                name="new-item-note"
                onEdited={handleValueEdited}
                placeholder="Click here to add a new item"
                inputPlaceholder="Type what to do"
                sx={{minWidth: 0, flex: 1}}/>
        </ListItemContent>
    );
}

export default ChecklistPlaceholder;
