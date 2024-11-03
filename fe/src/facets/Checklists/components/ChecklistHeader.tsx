import React from "react";
import {ListItemContent, Skeleton, Typography} from "@mui/joy";
import {useChecklist} from "../hooks";

const ChecklistHeader: React.FC = () => {
    const {data, groups, isLoading} = useChecklist();
    const group = groups.get(null);
    const counts = group ? `[${group.doneCount}/${group.items.length}] ` : "";

    return (
        <ListItemContent>
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
