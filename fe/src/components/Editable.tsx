import React, { KeyboardEvent, useEffect, useRef, useState } from 'react';
import Typography, { TypographyProps } from '@mui/joy/Typography';
import Textarea from '@mui/joy/Textarea';

export type EditableTypographyProps = {
  name?: string;
  value?: string | null;
  disabled?: boolean;
  multiline?: boolean;
  placeholder?: string;
  inputPlaceholder?: string;
  autoTrim?: boolean;
  onEdited?: (value?: string) => boolean | undefined | void;
} & TypographyProps;

// TODO: use Input instead of Textarea unless multiline is true
// TODO: leverage forwardRef/useImperativeHandle to expose edit() method

const EditableTypography: React.FC<EditableTypographyProps> = ({
  name,
  value,
  disabled,
  onEdited,
  autoTrim,
  multiline,
  placeholder,
  inputPlaceholder,
  sx,
  ...other
}) => {
  const originalValueRef = useRef<string>();
  const [editedValue, setEditedValue] = useState<string | undefined>();
  const [editMode, setEditMode] = useState(false);

  const beginEditing = () => {
    if (!disabled) {
      originalValueRef.current = editedValue;
      setEditMode(true);
    }
  };

  const handleValueChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    let value = e.target.value;
    if (autoTrim) value = value.trimStart();
    setEditedValue(value);
  };

  const endEditing = (cancelled?: boolean) => {
    let value = editedValue ?? '';
    if (autoTrim) value = value?.trimEnd();
    if (!cancelled) cancelled = onEdited?.(value) === false;
    if (cancelled) setEditedValue(originalValueRef.current);
    setEditMode(false);
  };

  const handleInputKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (
      (e.code === 'Enter' || e.code === 'Escape') &&
      !(e.metaKey || e.ctrlKey || e.altKey || e.shiftKey)
    ) {
      endEditing(e.code === 'Escape');
      e.preventDefault();
    }
  };

  useEffect(() => {
    setEditedValue(value ?? '');
  }, [value]);

  return editMode ? (
    <Textarea
      autoFocus
      name={name}
      id={other.id}
      value={editedValue}
      onChange={handleValueChange}
      onBlur={() => endEditing()}
      onKeyDown={handleInputKeyDown}
      maxRows={multiline ? undefined : 1}
      placeholder={inputPlaceholder}
      variant={other.variant}
      color={other.color}
      sx={[
        (theme) => ({
          '--Textarea-radius': 0,
          '--Textarea-minHeight': 0,
          '--Textarea-focusedThickness': 0,
          '--Textarea-paddingBlock': '0.1em',
          '--Textarea-paddingInline': '0.25em',
          marginInline: '-0.25em',
          border: 'none',
          boxShadow: 'none',
          typography:
            other.level && other.level !== 'inherit'
              ? theme.typography[other.level]
              : undefined,
          color: other.color
            ? theme.palette[other.color].mainChannel
            : undefined,
          ...((!other.variant || other.variant === 'plain') && {
            background: 'transparent',
            '&:focus-within': {
              background: 'transparent',
            },
          }),
        }),
        ...(Array.isArray(sx) ? sx : [sx]),
      ]}
    />
  ) : (
    <Typography
      {...other}
      onClick={() => beginEditing()}
      sx={[
        {
          // avoid fluctuation of width when editing headings (h1, h2, etc.)
          letterSpacing: 0,
        },
        !editedValue &&
          ((theme) => ({
            color: theme.palette[other.color || 'neutral'].mainChannel,
            fontStyle: editedValue ? 'inherit' : 'italic',
          })),
        ...(Array.isArray(sx) ? sx : [sx]),
      ]}>
      {editedValue || placeholder}
    </Typography>
  );
};

const Editable = {
  Typography: EditableTypography,
};

export default Editable;
