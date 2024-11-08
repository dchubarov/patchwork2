import React from "react";
import {ListItemContent, Typography} from "@mui/joy";
import {AddCircle as AddIcon} from "@mui/icons-material";
import EditableContent from "@/components/EditableContent";
import {useChecklist} from "../hooks";

const ChecklistPlaceholder: React.FC = () => {
    const {addOrUpdateItem} = useChecklist();
    const handleValueEdited = (editedValue: string) => {
        if (editedValue.trim() !== '') {
            addOrUpdateItem({
                id: ''/*new*/,
                note: editedValue.trim(),
                parent: null,
                done: false,
                colorLabel: null,
                sequenceCode: 0,
            });
        }
        return false; // restore original value
    }

    return (
        <ListItemContent sx={{display: "flex", gap: 1, alignItems: "center"}}>
            <AddIcon sx={{mx: "2px", color: "var(--joy-palette-neutral-400)"}}/>
            <EditableContent
                autoEdit
                id='new-item'
                onEdited={handleValueEdited}
                displayPlaceholder="Click here to add a new item"
                inputPlaceholder="Type what to do"
                sx={{minWidth: 0, flex: 1}}>
                <Typography noWrap/>
            </EditableContent>
        </ListItemContent>
    );
}

export default ChecklistPlaceholder;
