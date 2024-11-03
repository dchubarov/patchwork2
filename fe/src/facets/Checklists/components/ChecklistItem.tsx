import React from "react";
import {IconButton, IconButtonProps, List, ListItem} from "@mui/joy";
import {KeyboardArrowDown as ExpandedIcon} from "@mui/icons-material";
import {ChecklistItemData} from "../types/schema";
import ChecklistGroup from "./ChecklistGroup";
import ChecklistItemContent from "./ChecklistItemContent";
import {useChecklist} from "../hooks";

interface ChecklistItemProps {
    level: number;
    item: ChecklistItemData;
    showIds?: boolean;
}

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

const ChecklistItem: React.FC<ChecklistItemProps> = ({level, item, showIds}) => {
    const {groups, setGroupExpanded} = useChecklist();
    const group = groups.get(item.id);

    const contentElement =
        <ChecklistItemContent
            level={level}
            item={item}
            group={group}
            showId={showIds}/>;

    return (
        <ListItem nested={!!group}>
            {!group ? contentElement : <>
                <ListItem
                    component="div"
                    startAction={
                        <ChecklistGroupExpandButton
                            expanded={group.expanded}
                            onClick={() => setGroupExpanded(item.id, !group.expanded)}
                        />}
                    sx={{
                        '--ListItem-startActionTranslateX':
                            `calc((${level - 1} * var(--List-nestedInsetStart, 1.25rem)) - 30%)`,
                    }}>
                    {contentElement}
                </ListItem>

                {group.expanded && <List>
                    <ChecklistGroup
                        level={level + 1}
                        rootId={item.id}
                        showIds={showIds}/>
                </List>}
            </>}
        </ListItem>
    );
}

export default ChecklistItem;
