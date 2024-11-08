import React from "react";
import {AspectRatio, ListItemContent, Tooltip, Typography} from "@mui/joy";
import PieProgress from "@/components/PieProgress";
import {useChecklist} from "../hooks";
import EditableContent from "@/components/EditableContent";

const ChecklistHeader: React.FC = () => {
    const {data, groups, isLoading} = useChecklist();
    const group = groups.get(null);
    const progress = !!group ? group.doneCount / group.doableCount * 100 : 0;
    const counts = group ? `${group.doneCount} / ${group.doableCount}` : "";

    return (
        <ListItemContent sx={{
            display: "flex",
            gap: 1,
            alignItems: "center",
            ml: "-0.35rem",
        }}>
            <Tooltip title={counts} arrow>
                <AspectRatio
                    ratio={1}
                    variant="soft"
                    sx={(theme) => ({
                        width: theme.vars.fontSize.xl4,
                        borderRadius: '50%',
                    })}>
                    <PieProgress value={progress} margin={3} zeroIndicator/>
                </AspectRatio>
            </Tooltip>

            <EditableContent
                id='checklist-title'
                editOn='doubleClick'
                disableEdit={isLoading || !data}
                value={data?.title}>
                <Typography level="h2" sx={{letterSpacing: "normal"}}/>
            </EditableContent>
        </ListItemContent>
    );
}

export default ChecklistHeader;
