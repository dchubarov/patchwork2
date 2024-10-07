import React, {useState} from "react";
import ChecklistItem from "./ChecklistItem";
import {ChecklistItemData} from "../types";
import {Stack} from "@mui/joy";
import _ from "lodash";

const Checklist: React.FC = () => {
    const [items, setItems] = useState<ChecklistItemData[]>([]);
    const [count, setCount] = useState(1);

    const addItem = (item: ChecklistItemData) => {
        if (item.note) {
            setItems((prev) => ([{...item, id: count}, ...prev]));
            setCount((prev) => prev + 1);
        }
    }

    const updateItem = (updatedItem: ChecklistItemData) => {
        if (updatedItem.id) {
            setItems((prev) => {
                let isUpdated = false;
                const updated = prev.map((item) => {
                    if (item.id === updatedItem.id && !_.isEqual(item, updatedItem)) {
                        isUpdated = true;
                        return updatedItem;
                    }
                    return item;
                });
                return isUpdated ? updated : prev;
            });
        }
    }

    return (
        <Stack gap={1}>
            <ChecklistItem onUpdate={addItem}/>

            {items.map((item) => (
                <ChecklistItem
                    key={`item-${item.id}`}
                    checklistItem={item}
                    onUpdate={updateItem}/>
            ))}
        </Stack>
    );
}

export default Checklist;
