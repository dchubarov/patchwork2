import React, {useContext} from "react";
import {List, ListItem, ListItemContent, ListProps, Typography} from "@mui/joy";
import ChecklistGroup from "./ChecklistGroup";
import {ChecklistContext} from "../types/context";

type ChecklistComponentType = React.FC<{
    showIds?: boolean;
} & ListProps>;

const Checklist: ChecklistComponentType = ({showIds, sx, ...other}) => {
    const ctx = useContext(ChecklistContext);
    if (ctx === null || ctx.data === null)
        return null;

    return (
        <List
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
                    <Typography level="h2">{ctx.data.title}</Typography>
                </ListItemContent>
            </ListItem>

            {ctx.data.items.length > 0 && <ChecklistGroup
                level={1}
                items={ctx.data.items}
                showIds={showIds}/>}
        </List>
    );
}

export default Checklist;
