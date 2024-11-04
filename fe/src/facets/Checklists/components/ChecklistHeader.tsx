import React from "react";
import {ListItemContent, Skeleton, Typography} from "@mui/joy";
import {useChecklist} from "../hooks";
import {Circle as PlaceholderIcon} from "@mui/icons-material";

const ChecklistHeader: React.FC = () => {
    const {data, groups, isLoading} = useChecklist();
    const group = groups.get(null);
    const counts = group ? `[${group.doneCount}/${group.items.length}] ` : "";

    return (
        <ListItemContent sx={{
            display: "flex",
            gap: 1,
            alignItems: "center",
            ml: "-0.35rem",
        }}>
            <PlaceholderIcon fontSize="xl4" sx={{color: "var(--joy-palette-neutral-700)"}}/>

            <Typography level="h2" startDecorator={<Typography level="title-md"
                                                               sx={{color: "text.tertiary"}}>{counts}</Typography>}>
                <Skeleton loading={isLoading && !data}>
                    {data ? data.title : 'Loading'}
                </Skeleton>
            </Typography>
        </ListItemContent>
    );
}

export default ChecklistHeader;
