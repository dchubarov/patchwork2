import {omit} from "lodash";
import React from "react";
import {AspectRatio, Box, Checkbox, FormControl, FormLabel, Input, Radio} from "@mui/joy";
import Editable, {EditableTypographyProps} from "@/components/Editable";
import PieProgress, {PieProgressProps} from "@/components/PieProgress";
import {UIComponentCardProps} from "./UIComponentCard";

const editableTypography: UIComponentCardProps<EditableTypographyProps & { rejectChanges?: boolean }> = {
    title: "Editable Typography",
    initialState: {
        rejectChanges: false,
        disabled: false,
        multiline: false,
        value: "Some editable text",
        level: "body-lg",
        color: "primary",
        variant: "plain"
    },
    displayPanel: (state, dispatch) => (
        <Editable.Typography
            {...omit(state, "rejectChanges")}
            name="editable-typography"
            onEdited={(value) => {
                if (state.rejectChanges) return false;
                dispatch((prev) => ({...prev, value}));
            }}
            placeholder="Empty"
            inputPlaceholder="Type anything"
            noWrap={!state.multiline}
            sx={{minWidth: 0}}
        />
    ),
    controlPanel: (state, dispatch) => (<>
        <FormControl size="sm">
            <FormLabel>Value to edit</FormLabel>
            <Input
                type="text"
                autoComplete="off"
                name="editable-typography-value"
                value={state.value!!}
                onChange={(e) =>
                    dispatch((prev) => ({...prev, value: e.target.value}))}/>
        </FormControl>
        <Box sx={{display: 'flex', flexWrap: 'wrap', gap: 2}}>
            <Checkbox
                size="sm"
                label="Multiline"
                checked={state.multiline}
                name="editable-typography-multiline"
                onChange={(e) =>
                    dispatch((prev) =>
                        ({...prev, multiline: e.target.checked}))}
            />
            <Checkbox
                size="sm"
                label="Background"
                checked={state.variant === "soft"}
                name="editable-typography-bg"
                onChange={(e) =>
                    dispatch((prev) =>
                        ({...prev, variant: e.target.checked ? "soft" : "plain"}))}
            />
            <Checkbox
                size="sm"
                label="Disabled"
                checked={state.disabled}
                name="editable-typography-disabled"
                onChange={(e) =>
                    dispatch((prev) =>
                        ({...prev, disabled: e.target.checked}))}
            />
            <Checkbox
                size="sm"
                color="danger"
                label="Reject changes"
                checked={state.rejectChanges}
                name="editable-typography-reject"
                onChange={(e) =>
                    dispatch((prev) =>
                        ({...prev, rejectChanges: e.target.checked, color: e.target.checked ? "danger" : "primary"}))}
            />
        </Box>
        <Box sx={{display: 'flex', gap: 2, alignItems: "center"}}>
            <Radio
                size="sm"
                label="Body"
                name="editable-typography-body"
                checked={state.level === "body-lg" || state.level === "body-md" || state.level === "body-sm" || state.level === "body-xs"}
                onChange={() => dispatch((prev) => ({...prev, level: "body-lg"}))}
            />
            <Radio
                size="sm"
                label="Title"
                name="editable-typography-title"
                checked={state.level === "title-lg" || state.level === "title-md" || state.level === "title-sm"}
                onChange={() => dispatch((prev) => ({...prev, level: "title-lg"}))}
            />
            <Radio
                size="sm"
                label="Heading"
                name="editable-typography-heading"
                checked={state.level === "h1" || state.level === "h2" || state.level === "h3" || state.level === "h4"}
                onChange={() => dispatch((prev) => ({...prev, level: "h3"}))}
            />
        </Box>
    </>),
};

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
    editableTypography,
    pieProgress,
}

export default UIComponentLibrary;
