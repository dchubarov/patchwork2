import React from "react";
import {AspectRatio, Checkbox, FormControl, FormLabel, Input} from "@mui/joy";
import {UIComponentCardProps} from "./UIComponentCard";
import PieProgress from "@/components/PieProgress";

interface PieProgressState {
    progressValue: number;
    zeroIndicator: boolean;
}

const pieProgress: UIComponentCardProps<PieProgressState> = {
    title: "Pie Progress",
    initialState: {progressValue: 15, zeroIndicator: true},
    displayPanel: (state) => (
        <AspectRatio ratio={1} sx={{width: "120px"}}>
            <PieProgress
                value={state.progressValue}
                zeroIndicator={state.zeroIndicator}
            />
        </AspectRatio>
    ),
    controlPanel: (state, dispatch) => (<>
        <FormControl size="sm">
            <FormLabel>Progress value</FormLabel>
            <Input
                type="number"
                name="pie-progress-value"
                value={state.progressValue}
                slotProps={{input: {min: 0, max: 100, step: 1, size: 5}}}
                onChange={(e) =>
                    dispatch((prev) =>
                        ({...prev, progressValue: parseInt(e.target.value)}))}
            />
        </FormControl>
        <Checkbox
            size="sm"
            label="Zero indicator"
            checked={state.zeroIndicator}
            onChange={(e) =>
                dispatch((prev) =>
                    ({...prev, zeroIndicator: e.target.checked}))}
        />
    </>),
}

const UIComponentLibrary = {
    pieProgress,
}

export default UIComponentLibrary;
