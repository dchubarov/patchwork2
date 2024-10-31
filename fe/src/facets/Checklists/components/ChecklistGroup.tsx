import React from "react";
import {ChecklistItemData} from "../types";
import ChecklistItem from "./ChecklistItem";

type ChecklistGroupComponentType = React.FC<{
    level: number;
    items: ChecklistItemData[];
    showIds?: boolean;
}>;

const ChecklistGroup: ChecklistGroupComponentType = ({level, items, showIds}) => {
    return (<>
        {items.map(item => (
            <ChecklistItem
                key={item.id}
                level={level}
                item={item}
                showIds={showIds}/>
        ))}
    </>);
}

export default ChecklistGroup;
