import React from "react";
import {useQuery} from "@tanstack/react-query";
import {useApiClient} from "@/hooks";
import {List, ListItem, ListItemContent, Typography} from "@mui/joy";
import * as checklistApi from "../api";
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

    return (<>
        {(fetchChecklistStatus === "success" && checklistData) && <List
            sx={{
                '--List-gap': 0,
                '--List-padding': 0,
                '--ListItem-minHeight': "40px",
                '--List-nestedInsetStart': "1.75rem",
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
                items={checklistData.items}
                showIds={showIds}/>}
        </List>}
    </>);
}

export default Checklist;
