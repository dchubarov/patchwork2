import React from "react";
import {ListItemContent, Typography} from "@mui/joy";
import {AddCircle as AddIcon} from "@mui/icons-material";

const ChecklistPlaceholder: React.FC = () => {
    return (
        <ListItemContent sx={{display: "flex", gap: 1, alignItems: "center"}}>
            <AddIcon sx={{mx: "2px", color: "var(--joy-palette-neutral-400)"}}/>
            <Typography
                noWrap
                sx={{minWidth: 0, flex: 1, fontStyle: "italic", color: "var(--joy-palette-text-tertiary)"}}>
                Click here to add a new item
            </Typography>

        </ListItemContent>
    );
}

export default ChecklistPlaceholder;
