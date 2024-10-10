import {extendTheme, Theme} from "@mui/joy";

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

declare module "@mui/joy/styles" {
    // noinspection
    interface Palette {
        colorLabel: ColorLabelPalette
    }
}

const defaultColorLabels: ColorLabelPalette = {
    // Credit: https://github.com/tailwindlabs/tailwindcss/blob/main/src/public/colors.js
    teal: {
        100: "#ccfbf1",
        200: "#99f6e4",
        300: "#5eead4",
        400: "#2dd4bf",
        500: "#14b8a6",
        600: "#0d9488",
        700: "#0f766e",
        800: "#115e59",
        900: "#134e4a",
    },
    pink: {
        100: "#fce7f3",
        200: "#fbcfe8",
        300: "#f9a8d4",
        400: "#f472b6",
        500: "#ec4899",
        600: "#db2777",
        700: "#be185d",
        800: "#9d174d",
        900: "#831843",
    },
    emerald: {
        100: "#d1fae5",
        200: "#a7f3d0",
        300: "#6ee7b7",
        400: "#34d399",
        500: "#10b981",
        600: "#059669",
        700: "#047857",
        800: "#065f46",
        900: "#064e3b",
    },
    indigo: {
        100: "#e0e7ff",
        200: "#c7d2fe",
        300: "#a5b4fc",
        400: "#818cf8",
        500: "#6366f1",
        600: "#4f46e5",
        700: "#4338ca",
        800: "#3730a3",
        900: "#312e81",
    },
    sky: {
        100: "#e0f2fe",
        200: "#bae6fd",
        300: "#7dd3fc",
        400: "#38bdf8",
        500: "#0ea5e9",
        600: "#0284c7",
        700: "#0369a1",
        800: "#075985",
        900: "#0c4a6e",
    },
    fuchsia: {
        100: "#fae8ff",
        200: "#f5d0fe",
        300: "#f0abfc",
        400: "#e879f9",
        500: "#d946ef",
        600: "#c026d3",
        700: "#a21caf",
        800: "#86198f",
        900: "#701a75",
    },
}

const appTheme = extendTheme({
    colorSchemes: {
        light: {
            palette: {
                colorLabel: defaultColorLabels
            }
        },
        dark: {
            palette: {
                colorLabel: defaultColorLabels
            }
        }
    }
});

export default appTheme;

export function labelColorsByName(name?: string, theme?: Theme): ColorLabelPaletteRange {
    const t = theme || appTheme;
    const p = name ? t.palette.colorLabel[name] : undefined;
    return p || t.palette.neutral;
}
