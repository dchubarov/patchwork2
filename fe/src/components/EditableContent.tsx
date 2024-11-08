import React, {
    cloneElement,
    isValidElement,
    KeyboardEvent,
    PropsWithChildren,
    ReactElement,
    useEffect,
    useRef,
    useState
} from "react";
import {BoxProps, Input, InputProps, Typography, TypographyProps, useTheme} from "@mui/joy";

type EditableContentProps = PropsWithChildren<{
    autoEdit?: boolean;
    disableEdit?: boolean;
    editOn?: 'click' | 'doubleClick';
    value?: string;
    displayPlaceholder?: string;
    inputPlaceholder?: string;
    onEdited?: (editedValue: string) => boolean | void;
}> & BoxProps;

const EditableContent: React.FC<EditableContentProps> = ({
                                                             autoEdit,
                                                             disableEdit,
                                                             editOn = 'click',
                                                             value,
                                                             children,
                                                             sx,
                                                             onEdited,
                                                             ...props
                                                         }) => {

    const inputRef = useRef<HTMLInputElement | null>(null);
    const originalValueRef = useRef<string>();
    const [editMode, setEditMode] = useState<boolean>(false);
    const [currentValue, setCurrentValue] = useState('');
    const theme = useTheme();

    useEffect(() => {
        if (autoEdit && !disableEdit) setEditMode(true);
    }, [autoEdit, disableEdit]);

    useEffect(() => {
        originalValueRef.current = value;
        setCurrentValue(value ?? '');
    }, [value]);

    const beginEditing = (e?: React.MouseEvent<HTMLDivElement>) => {
        if (!disableEdit) setEditMode(true);
        e?.preventDefault();
    }

    const valueEdited = (cancelled?: boolean) => {
        if (!cancelled && inputRef.current?.value !== (originalValueRef.current ?? '')) {
            if (onEdited?.(inputRef.current?.value || '') === false) cancelled = true;
        }
        if (cancelled) setCurrentValue(originalValueRef.current ?? '');
        setEditMode(false);
    }

    const handleInputKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
        if ((e.code === "Enter" || e.code === "Escape") && !(e.metaKey || e.ctrlKey || e.altKey || e.shiftKey)) {
            valueEdited(e.code === "Escape");
            e.preventDefault();
        }
    }

    let displayElement: ReactElement | null = null;
    let inputProps: InputProps = {
        id: `${props.id}-input`,
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
                id: props.id,
                onClick: editOn === 'click' ? beginEditing : undefined,
                onDoubleClick: editOn === 'doubleClick' ? beginEditing : undefined,
                sx: [
                    ...Array.isArray(children.props.sx) ? children.props.sx : [children.props.sx],
                    ...Array.isArray(sx) ? sx : [sx],
                    // For placeholder display
                    (!value && {fontStyle: "italic", color: theme.palette.text.tertiary}),
                ],
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

            displayElement = cloneElement(children, displayProps, currentValue || props.displayPlaceholder);
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
                value={currentValue}
                onChange={(e) => setCurrentValue(e.target.value)}
                onKeyDown={handleInputKeyDown}
                onBlur={() => valueEdited()}
            />
            : displayElement}
    </>);
}

export default EditableContent;
