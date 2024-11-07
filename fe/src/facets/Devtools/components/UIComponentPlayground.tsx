import React, {ReactElement, useState} from "react";
import {IndexedLayoutChildProps} from "@/types/layout";
import {
    AspectRatio,
    Box,
    Card,
    Checkbox,
    Divider,
    FormControl,
    FormLabel,
    IconButton,
    Input,
    Stack, Tooltip,
    Typography
} from "@mui/joy";
import {KeyboardArrowDown as ExpandedIcon, RestartAlt as ResetIcon} from "@mui/icons-material";
import PieProgress from "@/components/PieProgress";

interface UIComponentCardProps {
    title?: string;
    initialState?: any;
    displayPanel?: (state: any) => ReactElement;
    controlPanel?: (state: any, dispatch: React.Dispatch<any>) => ReactElement;
}

const UIComponentCard: React.FC<UIComponentCardProps> = ({title, initialState = {}, displayPanel, controlPanel}) => {
    const [state, dispatch] = useState(initialState);
    const [expanded, setExpanded] = useState(true);
    return (
        <Card variant="outlined">
            <Typography
                level="h3"
                startDecorator={
                    <IconButton size="sm" onClick={() => setExpanded(prev => !prev)}>
                        <ExpandedIcon sx={{transform: expanded ? "none" : "rotate(-90deg)"}}/>
                    </IconButton>}>
                {title || 'Untitled'}
            </Typography>

            {expanded && <>
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

                <Stack direction="row" sx={{justifyContent: "flex-start", alignItems: "center"}}>
                    <Box sx={{flex: 1}}>
                        {displayPanel?.(state)}
                    </Box>
                    <Stack direction="column" spacing={2} sx={{flex: 2}}>
                        {controlPanel?.(state, dispatch)}
                    </Stack>
                </Stack>
            </>}
        </Card>
    );
}

const UIComponentPlayground: React.FC<IndexedLayoutChildProps> = () => {
    return (
        <Stack gap={2}>
            <UIComponentCard
                title="Pie Progress"
                initialState={{progressValue: 15, zeroIndicator: true}}
                displayPanel={(state => (
                    <AspectRatio ratio={1} sx={{width: "120px"}}>
                        <PieProgress
                            value={state.progressValue || 50}
                            zeroIndicator={state.zeroIndicator || false}/>
                    </AspectRatio>
                ))}
                controlPanel={(state, dispatch) => (<>
                    <FormControl size="sm">
                        <FormLabel>Progress value</FormLabel>
                        <Input
                            type="number"
                            value={state.progressValue}
                            onChange={(e) =>
                                dispatch((prev: any) => ({...prev, progressValue: e.target.value}))}
                            slotProps={{input: {min: 0, max: 100, step: 1, size: 5}}}
                        />
                    </FormControl>
                        <Checkbox
                            size="sm"
                            label="Zero indicator"
                            checked={state.zeroIndicator}
                            onChange={(e) =>
                                dispatch((prev: any) => ({...prev, zeroIndicator: e.target.checked}))}
                        />
                </>)}
            />
        </Stack>
    );
}

export default UIComponentPlayground;
