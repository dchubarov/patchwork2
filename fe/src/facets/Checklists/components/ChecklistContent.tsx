import React from "react";
import {List, ListItem, ListProps} from "@mui/joy";
import ChecklistGroup from "./ChecklistGroup";
import ChecklistHeader from "./ChecklistHeader";

export type ChecklistContentProps = {
    showIds?: boolean;
} & ListProps;

const ChecklistContent: React.FC<ChecklistContentProps> = ({showIds = false, sx, ...other}) => {
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
                    // [`& .${listItemClasses.root}:not(.${listItemClasses.nested}) :hover`]: {
                    //     backgroundColor: 'var(--joy-palette-primary-50)'
                    // },
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
                <ChecklistHeader/>
            </ListItem>

            <ChecklistGroup
                level={1}
                rootId={null}
                showIds={showIds}
            />
        </List>
    );
}

export default ChecklistContent;
