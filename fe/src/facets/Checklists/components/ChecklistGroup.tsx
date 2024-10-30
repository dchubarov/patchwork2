import React from "react";
import {ChecklistItemData, ChecklistGroupSummaryData} from "../types";
import ChecklistItem from "./ChecklistItem";

type ChecklistGroupComponentType = React.FC<{
    level: number;
    groupFn: (itemId: string) => ChecklistGroupSummaryData | null;
    selectFn: (parentId: string | null) => ChecklistItemData[];
    parentId?: string | null;
    showIds?: boolean;
}>;

const ChecklistGroup: ChecklistGroupComponentType = ({level, selectFn, groupFn, parentId = null, showIds}) => {
    const items = selectFn(parentId);
    return (<>
        {items.map(item => (
            <ChecklistItem
                key={item.id}
                level={level}
                item={item}
                groupFn={groupFn}
                selectFn={selectFn}
                showIds={showIds}/>
        ))}
    </>);
}

export default ChecklistGroup;
