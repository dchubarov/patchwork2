import React from "react";
import {ListItemContent, Skeleton, Typography} from "@mui/joy";
import {AddCircle as AddIcon} from "@mui/icons-material";
import {useChecklist} from "../hooks";

const ChecklistPlaceholder: React.FC = () => {
    const {isLoading, data} = useChecklist();
    return (
        <ListItemContent sx={{display: "flex", gap: 1, alignItems: "center"}}>
            <AddIcon sx={{mx: "2px", color: "var(--joy-palette-neutral-400)"}}/>
            <Typography
                noWrap
                sx={{minWidth: 0, flex: 1, fontStyle: "italic", color: "var(--joy-palette-text-tertiary)"}}>
                <Skeleton loading={isLoading && !data}>
                    Click here to add a new item
                </Skeleton>
            </Typography>

        </ListItemContent>
    );
}

export default ChecklistPlaceholder;
