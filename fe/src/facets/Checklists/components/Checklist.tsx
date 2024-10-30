import React from "react";
import {useQuery} from "@tanstack/react-query";
import {useApiClient} from "@/hooks";
import {List, ListItem, ListItemContent, Typography} from "@mui/joy";
import * as checklistApi from "../api";
import {ChecklistGroupSummaryData, ChecklistItemData} from "../types";
import ChecklistGroup from "./ChecklistGroup";

type ChecklistComponentType = React.FC<{
    checklistId: string | null;
    showIds?: boolean;
}>;

const Checklist: ChecklistComponentType = ({checklistId, showIds}) => {
    const apiClient = useApiClient();

    const {status: fetchChecklistStatus, data: fetchChecklistData} = useQuery({
        queryKey: ["x/checklists/checklist", {checklistId}],
        queryFn: checklistApi.fetchChecklistRequest(apiClient, checklistId),
    });

    const checklistData = fetchChecklistData?.checklist || null;

    const selectItems = (parentId: string | null): ChecklistItemData[] => {
        // TODO loop guard
        return checklistData?.items.filter(item => item.parentId === parentId) || [];
    }

    const groupSummary = (itemId: string): ChecklistGroupSummaryData | null => {
        const children = selectItems(itemId);
        return children.length ? children.reduce((acc, item) =>
                ({total: acc.total + 1, done: item.done ? acc.done + 1 : acc.done}),
            {total: 0, done: 0} as ChecklistGroupSummaryData) : null;
    }

    return (<>
        {(fetchChecklistStatus === "success" && checklistData) && <List
            sx={{
                '--List-gap': 0,
                '--List-padding': 0,
                '--ListItem-minHeight': "40px",
                '--List-nestedInsetStart': "1.25rem",
                "--ListItem-paddingLeft": "1.5rem",
                '--ListItem-startActionWidth': 0,
                '--ListItem-startActionTranslateX': "-30%",
                '& [class*="startAction"]': {
                    color: 'var(--joy-palette-text-tertiary)',
                    backgroundColor: 'transparent',
                },
                '& [class*="startAction"] :hover': {
                    backgroundColor: "transparent",
                },
            }}>

            <ListItem>
                <ListItemContent>
                    <Typography level="h2">{checklistData.title}</Typography>
                </ListItemContent>
            </ListItem>

            {checklistData.items.length > 0 && <ChecklistGroup
                level={1}
                selectFn={selectItems}
                groupFn={groupSummary}
                showIds={showIds}/>}
        </List>}
    </>);
}

export default Checklist;
