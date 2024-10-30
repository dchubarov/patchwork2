import React, {useState} from "react";
import {IconButton, IconButtonProps, List, ListItem} from "@mui/joy";
import {KeyboardArrowDown as ExpandedIcon} from "@mui/icons-material";
import {ChecklistGroupSummaryData, ChecklistItemData} from "../types";
import ChecklistGroup from "./ChecklistGroup";
import ChecklistItemContent from "./ChecklistItemContent";

type ChecklistItemComponentType = React.FC<{
    level: number;
    item: ChecklistItemData;
    groupFn: (itemId: string) => ChecklistGroupSummaryData | null;
    selectFn: (parentId: string | null) => ChecklistItemData[];
    showIds?: boolean;
}>;

const ChecklistGroupExpandButton: React.FC<IconButtonProps & { expanded: boolean }> = ({expanded, ...other}) => {
    return (
        <IconButton
            {...other}
            size="sm"
            variant="plain"
            sx={{
                borderRadius: "50%",
                transform: expanded ? undefined : "rotate(-90deg)",
            }}>
            <ExpandedIcon/>
        </IconButton>
    );
}

const ChecklistItem: ChecklistItemComponentType = ({level, item, groupFn, selectFn, showIds}) => {
    const [expanded, setExpanded] = useState(true);
    const group = groupFn(item.id);
    const contentElement = <ChecklistItemContent item={item} group={group} showId={showIds}/>;
    return (
        <ListItem nested={!!group}>
            {!group && contentElement}
            {group && <>
                <ListItem
                    component="div"
                    startAction={<ChecklistGroupExpandButton expanded={expanded} onClick={() => setExpanded(prev => !prev)}/>}
                    sx={{
                        '--ListItem-startActionTranslateX':
                            `calc((${level - 1} * var(--List-nestedInsetStart, 1.25rem)) - 30%)`,
                    }}>
                    {contentElement}
                </ListItem>

                {expanded && <List>
                    <ChecklistGroup
                        level={level + 1}
                        parentId={item.id}
                        groupFn={groupFn}
                        selectFn={selectFn}
                        showIds={showIds}/>
                </List>}
            </>}
        </ListItem>
    );
}

export default ChecklistItem;
