import React, {ReactElement, SetStateAction, useState} from "react";
import {Box, Card, CardContent, Divider, IconButton, Stack, Tooltip, Typography} from "@mui/joy";
import ExpandedIcon from "@mui/icons-material/KeyboardArrowDown";
import ResetIcon from "@mui/icons-material/RestartAlt";

export interface UIComponentCardProps<T = any> {
    title?: string;
    initialState?: T;
    displayPanel?: (state: T, dispatch: React.Dispatch<SetStateAction<T>>) => ReactElement;
    controlPanel?: (state: T, dispatch: React.Dispatch<SetStateAction<T>>) => ReactElement;
    expanded?: boolean;
    onExpandedChange?: (expanded: boolean) => void;
}

const UIComponentCard: React.FC<UIComponentCardProps> = ({
                                                             title,
                                                             initialState = {},
                                                             displayPanel,
                                                             controlPanel,
                                                             expanded = false,
                                                             onExpandedChange
                                                         }) => {
    const [state, dispatch] = useState(initialState);
    return (
        <Card variant="outlined" sx={{minWidth: "300px"}}>
            <Typography
                level="h3"
                startDecorator={
                    <IconButton size="sm" onClick={() => onExpandedChange?.(!expanded)}>
                        <ExpandedIcon sx={{transform: expanded ? "none" : "rotate(-90deg)"}}/>
                    </IconButton>}>
                {title || 'Untitled'}
            </Typography>

            {expanded && <CardContent>
                <Tooltip title="Reset state">
                    <IconButton
                        onClick={() => dispatch(initialState)}
                        sx={{
                            position: "absolute",
                            top: "calc(var(--Card-padding) + 0.015rem)",
                            right: 'var(--Card-padding)'
                        }}>
                        <ResetIcon/>
                    </IconButton>
                </Tooltip>

                <Divider inset="context"/>

                <Stack direction="row" spacing={2} sx={{justifyContent: "flex-start", alignItems: "center", mt: 1.5}}>
                    <Box sx={{flex: 1}}>
                        {displayPanel?.(state, dispatch)}
                    </Box>
                    <Stack direction="column" spacing={2} sx={{flex: 2}}>
                        {controlPanel?.(state, dispatch)}
                    </Stack>
                </Stack>
            </CardContent>}
        </Card>
    );
}

export default UIComponentCard;
