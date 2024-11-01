import React from "react";
import ChecklistItem from "./ChecklistItem";
import useChecklist from "../hooks/useChecklist";

type ChecklistGroupComponentType = React.FC<{
    level: number;
    rootId?: string | null;
    showIds?: boolean;
}>;

const ChecklistGroup: ChecklistGroupComponentType = ({level, rootId = null, showIds = false}) => {
    const {data} = useChecklist();
    const items = data?.items
        .filter(item => item.parent === rootId);

    return (<>
        {items && items.map(item => (
            <ChecklistItem
                key={item.id}
                level={level}
                item={item}
                showIds={showIds}/>
        ))}
    </>);
}

export default ChecklistGroup;
