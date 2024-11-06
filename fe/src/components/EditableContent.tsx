import React, {
    cloneElement,
    isValidElement,
    KeyboardEvent,
    PropsWithChildren,
    ReactElement, useCallback,
    useRef,
    useState
} from "react";
import {BoxProps, Input, InputProps, Typography, TypographyProps, useTheme} from "@mui/joy";

type EditableContentProps = PropsWithChildren<{
    autoEdit?: boolean;
    editOn?: 'click' | 'doubleClick';
    value?: string;
    displayPlaceholder?: string;
    inputPlaceholder?: string;
    onEdited?: (editedValue: string) => void;
}> & BoxProps;

const EditableContent: React.FC<EditableContentProps> = ({
                                                             autoEdit,
                                                             editOn = 'click',
                                                             value,
                                                             children,
                                                             sx,
                                                             onEdited,
                                                             ...props
                                                         }) => {

    const inputRef = useRef<HTMLInputElement | null>(null);
    const [editMode, setEditMode] = useState(autoEdit ?? false);
    const [editValue, setEditValue] = useState(value ? value : "");
    const theme = useTheme();

    let displayElement: ReactElement | null = null;
    let inputProps: InputProps = {
        sx: [
            {
                "--Input-focusedThickness": 0,
                "--Input-radius": 0,
                "--Input-paddingInLine": 0,
                "--Input-minHeight": 0,
                boxShadow: "none",
                border: "none",
            },
            ...Array.isArray(sx) ? sx : [sx]
        ],
    }

    if (isValidElement(children)) {
        if (children.type === Typography) {
            const displayProps: TypographyProps = {
                ...children.props,
                sx: [
                    ...Array.isArray(children.props.sx) ? children.props.sx : [children.props.sx],
                    ...Array.isArray(sx) ? sx : [sx],
                    // For placeholder display
                    (!value && {fontStyle: "italic", color: theme.palette.text.tertiary}),
                ],
                onDoubleClick: editOn === 'doubleClick' ? handleBeginEdit : undefined,
                onClick: editOn === 'click' ? handleBeginEdit : undefined,
            };

            if (Array.isArray(inputProps.sx)) inputProps.sx.push({
                ...((displayProps.level && displayProps.level !== "inherit") && theme.typography[displayProps.level]),
                color: displayProps.color ? theme.palette[displayProps.color].mainChannel : undefined,
                paddingBlock: displayProps.variant && displayProps.variant !== "plain" ? 'min(0.1em, 4px)' : undefined,
                margin: 'var(--Typography-margin, 0px)',
                paddingInline: '0.25em',
                marginInline: '-0.25em',
                ...((displayProps.variant ?? "plain") === "plain" && {
                    background: 'transparent',
                    "&:focus-within": {
                        background: 'transparent',
                    }
                })
            });

            if (displayProps.color) inputProps.color = displayProps.color;
            if (displayProps.variant) inputProps.variant = displayProps.variant;

            displayElement = cloneElement(children, displayProps, inputRef.current?.value ?? value ?? props.displayPlaceholder);
        }
    }

    function handleBeginEdit(_: React.MouseEvent) {
        setEditMode(true);
    }

    const valueEdited = useCallback((cancelled?: boolean) => {
        if (!cancelled && inputRef.current?.value !== (value ?? '')) {
            onEdited?.(inputRef.current?.value || '');
        }
        //setEditValue(value ?? '');
        setEditMode(false);
    }, [value, onEdited]);

    const handleInputKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
        if ((e.code === "Enter" || e.code === "Escape") && !(e.metaKey || e.ctrlKey || e.altKey || e.shiftKey)) {
            valueEdited(e.code === "Escape");
            e.preventDefault();
        }
    }

    if (displayElement == null) {
        console.warn('<EditableContent> must contain a supported child element: <Typography>.');
        return null;
    }

    return (<>
        {editMode
            ? <Input
                {...inputProps}
                autoFocus
                autoComplete="off"
                slotProps={{input: {ref: inputRef}}}
                placeholder={props.inputPlaceholder ?? props.displayPlaceholder}
                value={editValue}
                onChange={(e) => setEditValue(e.target.value)}
                onKeyDown={handleInputKeyDown}
                onBlur={() => valueEdited()}
            />
            : displayElement}
    </>);
}

export default EditableContent;
