import React from "react";
import {List, ListItem, ListItemContent, ListProps, Typography} from "@mui/joy";
import ChecklistGroup from "./ChecklistGroup";
import useChecklist from "../hooks/useChecklist";

type ChecklistComponentType = React.FC<{
    showIds?: boolean;
} & ListProps>;

const Checklist: ChecklistComponentType = ({showIds = false, sx, ...other}) => {
    const {data} = useChecklist();
    return (<>
        {data && <List
            {...other}
            sx={[
                {
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
                },
                ...Array.isArray(sx) ? sx : [sx]
            ]}>

            <ListItem>
                <ListItemContent>
                    <Typography level="h2">{data.title}</Typography>
                </ListItemContent>
            </ListItem>

            {data.items.length > 0 && <ChecklistGroup
                level={1}
                showIds={showIds}/>}
        </List>}
    </>);
}

export default Checklist;
