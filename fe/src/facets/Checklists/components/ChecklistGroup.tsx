import React from "react";
import ChecklistItem from "./ChecklistItem";
import useChecklist from "../hooks/useChecklist";

interface ChecklistGroupProps {
    level: number;
    rootId?: string | null;
    showIds?: boolean;
}

const ChecklistGroup: React.FC<ChecklistGroupProps> = ({level, rootId = null, showIds = false}) => {
    const {data} = useChecklist();
    const items = data?.items
        .filter(item => item.parent === rootId) || [];

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
