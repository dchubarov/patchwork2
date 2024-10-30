import React from "react";
import {IconButton, List, ListItem} from "@mui/joy";
import {KeyboardArrowDown} from "@mui/icons-material";
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

const ChecklistItem: ChecklistItemComponentType = ({level, item, groupFn, selectFn, showIds}) => {
    const group = groupFn(item.id);
    const contentElement = <ChecklistItemContent item={item} group={group} showId={showIds}/>;
    const collapseActionElement = (<IconButton
        size="sm"
        variant="plain"
        sx={{borderRadius: "100px"}}>
        <KeyboardArrowDown/>
    </IconButton>);

    return (
        <ListItem nested={!!group}>
            {!group && contentElement}
            {group && <>
                <ListItem
                    component="div"
                    startAction={collapseActionElement}
                    sx={{
                        '--ListItem-startActionTranslateX':
                            `calc((${level - 1} * var(--List-nestedInsetStart, 1.25rem)) - 30%)`,
                    }}>
                    {contentElement}
                </ListItem>
                <List>
                    <ChecklistGroup
                        level={level + 1}
                        parentId={item.id}
                        groupFn={groupFn}
                        selectFn={selectFn}
                        showIds={showIds}/>
                </List>
            </>}
        </ListItem>
    );
}

export default ChecklistItem;
