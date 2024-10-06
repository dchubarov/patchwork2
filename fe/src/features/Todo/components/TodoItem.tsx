import React, {useEffect, useRef, useState} from "react";
import {Box, Input, Typography} from "@mui/joy";
import {TodoItemData} from "../types";

type TodoItemComponentType = React.FC<{
    todoItem?: TodoItemData,
}>;

const TodoItem: TodoItemComponentType = ({todoItem}) => {
    const inlineEditorRef = useRef<HTMLInputElement | null>(null);
    const [editMode, setEditMode] = useState(false);

    useEffect(() => {
        if (editMode) inlineEditorRef.current?.focus();
    }, [editMode]);

    return (
        <Box
            sx={(theme) => ({
                display: "flex",
                alignItems: "center",
                borderRadius: "3rem",
                border: `2px dashed ${theme.palette.neutral.outlinedBorder}`,
                minWidth: "300px",
                py: 0.5,
                px: 2,
            })}>
            <Box sx={{flexGrow: 1}}>
                {editMode
                    ? (
                        <Input
                            slotProps={{
                                input: {ref: inlineEditorRef},
                            }}
                            onBlur={() => setEditMode(false)}
                            placeholder="Type what to do"
                            variant="plain"
                            size="lg"
                            sx={{
                                p: 0,
                                "--Input-focusedThickness": 0,
                                "--Input-radius": 0,
                                "--Input-paddingInLine": 0,
                                "--Input-minHeight": 0,
                                "&:focus-within": {
                                    background: "transparent",
                                }
                            }}/>
                    ) : (
                        <Typography
                            onClick={() => setEditMode(true)}
                            level="body-lg"
                            noWrap>
                            {todoItem?.message || "Click here to add a new item."}
                        </Typography>
                    )}
            </Box>
        </Box>
    );
}

export default TodoItem;
