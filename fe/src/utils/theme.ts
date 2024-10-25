import {Theme} from "@mui/joy";

export interface ColorLabelPaletteRange extends Record<number, string> {
    100: string;
    200: string;
    300: string;
    400: string;
    500: string;
    600: string;
    700: string;
    800: string;
    900: string;
}

export interface ColorLabelPalette extends Record<string, ColorLabelPaletteRange> {
}


export function labelColorsByName(name: string | null, theme: Theme): ColorLabelPaletteRange {
    const p = name ? theme.palette.colorLabel[name] : undefined;
    return p || theme.palette.neutral;
}
