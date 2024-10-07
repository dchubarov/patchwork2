import React from "react";
import {Input, InputProps} from "@mui/joy";

type InlineInputComponentType = {
    inputRef?: React.Ref<HTMLInputElement>
} & InputProps;

const InlineInput: React.FC<InlineInputComponentType> = ({inputRef, sx, ...other}) => (
    <Input
        {...other}
        variant="plain"
        slotProps={{
            input: {ref: inputRef},
        }}
        sx={[
            {
                p: 0,
                "--Input-focusedThickness": 0,
                "--Input-radius": 0,
                "--Input-paddingInLine": 0,
                "--Input-minHeight": 0,
                "&:focus-within": {
                    background: "transparent",
                }
            },
            ...Array.isArray(sx) ? sx : [sx]
        ]}/>
);

export default InlineInput;
