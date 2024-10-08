import React, {useState} from "react";
import {Stack} from "@mui/joy";
import ChecklistItem from "./ChecklistItem";
import {ChecklistItemData, ChecklistItemResponse, ChecklistItemsResponse} from "../types";
import useCall from "../../../lib/useCall";

type ChecklistComponentType = React.FC<{
    listName?: string
}>;

const Checklist: ChecklistComponentType = ({listName = "default"}) => {
    const [items, setItems] = useState<ChecklistItemData[]>([]);

    /*const fetchItemsCall =*/ useCall<{}, ChecklistItemsResponse>(
        {path: `checklists/v1/checklist/${listName}`},
        true, (data) => setItems(data.checklistItems));

    const addItemCall = useCall<ChecklistItemData, ChecklistItemResponse>(
        {path: `checklists/v1/checklist/${listName}`, method: "POST"},
        false, (data) => addItem(data.checklistItem)
    );

    const updateItemCall = useCall<ChecklistItemData, ChecklistItemResponse>(
        {path: `checklists/v1/checklist/${listName}`, method: "PUT"},
        false, (data) => updateItem(data.checklistItem)
    );

    const addItem = (item: ChecklistItemData) => {
        if (item && item.note) {
            setItems((prev) => ([item, ...prev]));
        }
    }

    const updateItem = (updatedItem: ChecklistItemData) => {
        if (updatedItem.id) {
            setItems((prev) => prev.map((item) => item.id === updatedItem.id ? updatedItem : item));
        }
    }

    return (
        <Stack gap={1}>
            <ChecklistItem
                defaultEdit
                busy={addItemCall.status === "loading"}
                onUpdate={(item) => addItemCall.execute({data: item})}/>

            {items.map((item) => (
                <ChecklistItem
                    key={`item-${item.id}`}
                    checklistItem={item}
                    busy={updateItemCall.status === "loading"}
                    onUpdate={(item) => updateItemCall.execute({data: item})}/>
            ))}
        </Stack>
    );
}

export default Checklist;
