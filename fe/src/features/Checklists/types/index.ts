
export interface ChecklistItemState {
    id?: number;
    list?: string;
    note?: string;
    done?: boolean;
    colorLabel?: string | null;
}

export interface ChecklistItemsResponse {
    checklistItems: ChecklistItemState[];
}

export interface ChecklistItemResponse {
    checklistItem: ChecklistItemState;
}
