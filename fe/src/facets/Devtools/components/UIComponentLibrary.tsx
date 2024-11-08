import React from "react";
import {AspectRatio, Checkbox, FormControl, FormLabel, Input} from "@mui/joy";
import {UIComponentCardProps} from "./UIComponentCard";
import PieProgress, {PieProgressProps} from "@/components/PieProgress";

const pieProgress: UIComponentCardProps<PieProgressProps> = {
    title: "Pie Progress",
    initialState: {value: 15, zeroIndicator: true, filled: true},
    displayPanel: (state) => (
        <AspectRatio ratio={1} color="primary" sx={{width: "120px", borderRadius: "50%"}}>
            <PieProgress {...state}/>
        </AspectRatio>
    ),
    controlPanel: (state, dispatch) => (<>
        <FormControl size="sm">
            <FormLabel>Progress value</FormLabel>
            <Input
                type="number"
                name="pie-progress-value"
                value={state.value}
                slotProps={{input: {min: 0, max: 100, step: 1, size: 5}}}
                onChange={(e) =>
                    dispatch((prev) =>
                        ({...prev, value: parseInt(e.target.value)}))}
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
        <Checkbox
            size="sm"
            label="Filled"
            checked={state.filled}
            onChange={(e) =>
                dispatch((prev) =>
                    ({...prev, filled: e.target.checked}))}
        />
    </>),
}

const UIComponentLibrary = {
    pieProgress,
}

export default UIComponentLibrary;
