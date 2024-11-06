import React from "react";
import {ListItemContent, Typography} from "@mui/joy";
import {AddCircle as AddIcon} from "@mui/icons-material";
import EditableContent from "@/components/EditableContent";

const ChecklistPlaceholder: React.FC = () => {
    return (
        <ListItemContent sx={{display: "flex", gap: 1, alignItems: "center"}}>
            <AddIcon sx={{mx: "2px", color: "var(--joy-palette-neutral-400)"}}/>
            <EditableContent
                autoEdit
                onEdited={(editedValue) => console.log(`Edited: ${editedValue}`)}
                displayPlaceholder="Click here to add a new item"
                inputPlaceholder="Type what to do"
                sx={{minWidth: 0, flex: 1}}>
                <Typography noWrap/>
            </EditableContent>
        </ListItemContent>
    );
}

export default ChecklistPlaceholder;
