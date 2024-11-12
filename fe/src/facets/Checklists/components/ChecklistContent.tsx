import React from "react";
import {List, ListItem, listItemClasses, ListProps} from "@mui/joy";
import ChecklistGroup from "./ChecklistGroup";
import ChecklistHeader from "./ChecklistHeader";
import ChecklistPlaceholder from "./ChecklistPlaceholder";

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
                    '--ListItem-paddingLeft': "1.5rem",
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

                    // Animations
                    [`& .${listItemClasses.nesting}-enter`]: {
                        maxHeight: 0,
                    },
                    [`& .${listItemClasses.nesting}-enter-active`]: {
                        transition: 'max-height 150ms ease-in',
                        overflowY: "hidden",
                        maxHeight: "300px",
                    },
                    [`& .${listItemClasses.nesting}-exit`]: {
                        maxHeight: "300px",
                    },
                    [`& .${listItemClasses.nesting}-exit-active`]: {
                        transition: 'max-height 150ms ease-in-out',
                        overflowY: "hidden",
                        maxHeight: 0,
                    },
                },
                ...Array.isArray(sx) ? sx : [sx]
            ]}>

            <ListItem>
                <ChecklistHeader/>
            </ListItem>

            <ListItem>
                <ChecklistPlaceholder/>
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
