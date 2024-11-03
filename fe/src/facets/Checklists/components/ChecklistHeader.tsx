import React from "react";
import {ListItemContent, Skeleton, Typography} from "@mui/joy";
import useChecklist from "../hooks/useChecklist";

const ChecklistHeader: React.FC = () => {
    const {data, isLoading} = useChecklist();
    return (
        <ListItemContent>
            <Typography level="h2">
                <Skeleton loading={isLoading && !data}>
                    {data ? data.title : 'Loading'}
                </Skeleton>
            </Typography>
        </ListItemContent>
    );
}

export default ChecklistHeader;
