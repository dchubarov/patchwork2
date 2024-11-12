import React from "react";
import {ListItemContent, Radio} from "@mui/joy";
import {AddCircle as AddIcon} from "@mui/icons-material";
import Editable from "@/components/Editable";
import {useChecklist} from "../hooks";

const ChecklistPlaceholder: React.FC = () => {
    const {updateItem, targetItemId, setTargetItem} = useChecklist();
    const handleValueEdited = (editedValue?: string) => {
        if (editedValue && editedValue.trim()) {
            updateItem({
                id: ''/*new*/,
                note: editedValue.trim(),
                parent: targetItemId ?? null,
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

            <Radio
                size="sm"
                color="neutral"
                variant="soft"
                checked={!targetItemId}
                onClick={() => setTargetItem(null)}
            />
        </ListItemContent>
    );
}

export default ChecklistPlaceholder;
