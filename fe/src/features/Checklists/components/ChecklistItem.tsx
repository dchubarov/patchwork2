import React, {useEffect, useRef, useState} from "react";
import {Box, Typography} from "@mui/joy";
import {ChecklistItemData} from "../types";
import InlineInput from "../../../components/InlineInput";

type ChecklistItemComponentType = React.FC<{
    checklistItem?: ChecklistItemData,
}>;

const ChecklistItem: ChecklistItemComponentType = ({checklistItem}) => {
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
                        <InlineInput
                            inputRef={inlineEditorRef}
                            onBlur={() => setEditMode(false)}
                            placeholder="Type what to do"
                            variant="plain"
                            size="lg"/>
                    ) : (
                        <Typography
                            onClick={() => setEditMode(true)}
                            level="body-lg"
                            noWrap>
                            {checklistItem?.message || "Click here to add a new item."}
                        </Typography>
                    )}
            </Box>
        </Box>
    );
}

export default ChecklistItem;
