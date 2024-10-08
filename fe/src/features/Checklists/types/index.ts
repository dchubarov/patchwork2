
export interface ChecklistItemData {
    id?: number;
    list?: string;
    note?: string;
    done?: boolean;
}

export interface ChecklistItemsResponse {
    checklistItems: ChecklistItemData[];
}

export interface ChecklistItemResponse {
    checklistItem: ChecklistItemData;
}
