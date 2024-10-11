import React, {useState} from "react";
import {Stack} from "@mui/joy";
import ChecklistItem from "./ChecklistItem";
import {ChecklistItemState, ChecklistItemResponse, ChecklistItemsResponse} from "../types";
import useCall from "../../../lib/useCall";

type ChecklistComponentType = React.FC<{
    checklistName?: string
}>;

const Checklist: ChecklistComponentType = ({checklistName = "default"}) => {
    const [items, setItems] = useState<ChecklistItemState[]>([]);
    const [updateId, setUpdateId] = useState<number | undefined>();

    const fetchItemsCall = useCall<{}, ChecklistItemsResponse>(
        {path: `checklists/v1/checklist/${checklistName}`},
        true, (data) => setItems(data.checklistItems));

    const addItemCall = useCall<ChecklistItemState, ChecklistItemResponse>(
        {path: `checklists/v1/checklist/${checklistName}`, method: "POST"},
        false, (data) => addItem(data.checklistItem)
    );

    const updateItemCall = useCall<ChecklistItemState, ChecklistItemResponse>(
        {path: `checklists/v1/checklist/${checklistName}`, method: "PUT"},
        false, (data) => updateItem(data.checklistItem)
    );

    const deleteItemCall = useCall(
        {path: `checklists/v1/checklist/${checklistName}`, method: "DELETE"},
        false, (data) => { deleteItem(data.checklistItem) }
    );

    const addItem = (item: ChecklistItemState) => {
        if (item && item.note) {
            setItems((prev) => ([item, ...prev]));
        }
    }

    const fireUpdateItem = (item: ChecklistItemState) => {
        setUpdateId(item.id);
        if (item.note === "") {
            deleteItemCall.execute({params: {id: item.id}});
        } else {
            updateItemCall.execute({data: item});
        }
    }

    const updateItem = (updatedItem: ChecklistItemState) => {
        if (updatedItem.id) {
            setItems((prev) =>
                prev.map((item) => item.id === updatedItem.id ? updatedItem : item));
        }
    }

    const deleteItem = (deletedItem: ChecklistItemState) => {
        setItems((prev) =>
            prev.filter((item) => item.id !== deletedItem.id))
    }

    return (
        <Stack gap={1}>
            <ChecklistItem
                defaultEdit
                placeholder="Click here to add a new item"
                busy={fetchItemsCall.status === "loading" || addItemCall.status === "loading"}
                onUpdate={(item) => addItemCall.execute({data: item})}/>

            {items.map((item) => (
                <ChecklistItem
                    key={item.id}
                    checklistItem={item}
                    placeholder="No content"
                    busy={(updateItemCall.status === "loading" || deleteItemCall.status === "loading") && updateId === item.id}
                    onUpdate={fireUpdateItem}/>
            ))}
        </Stack>
    );
}

export default Checklist;
