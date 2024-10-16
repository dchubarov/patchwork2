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
    interface Palette {
        colorLabel: ColorLabelPalette
    }
}

const defaultColorLabels: ColorLabelPalette = {
    ivory: {
        100: "#faf7d1",
        200: "#f5eea3",
        300: "#f0e575",
        400: "#ebdd47",
        500: "#e6d41a",
        600: "#b8aa14",
        700: "#8a7f0f",
        800: "#5c550a",
        900: "#454008",
    },
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
        100: "#fad1e6",
        200: "#f5a3cc",
        300: "#f075b3",
        400: "#eb4799",
        500: "#e61a80",
        600: "#b81466",
        700: "#8e104f",
        800: "#5c0a33",
        900: "#450826",
    },
    lime: {
        100: '#ecfccb',
        200: '#d9f99d',
        300: '#bef264',
        400: '#a3e635',
        500: '#84cc16',
        600: '#65a30d',
        700: '#4d7c0f',
        800: '#3f6212',
        900: '#365314'
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
    fontFamily: {
        display: "Roboto",
        body: "Roboto",
    },
    typography: {
        h1: {fontWeight: 700},
        h2: {fontWeight: 500},
        h3: {fontWeight: 500},
        h4: {fontWeight: 500},
        "title-lg": {fontWeight: 500},
        "title-md": {fontWeight: 500},
        "title-sm": {fontWeight: 400},
        "body-lg": {},
        "body-md": {},
        "body-sm": {},
        "body-xs": {fontWeight: 500},
    },
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

export function labelColorsByName(name?: string | null, theme?: Theme): ColorLabelPaletteRange {
    const t = theme || appTheme;
    const p = name ? t.palette.colorLabel[name] : undefined;
    return p || t.palette.neutral;
}
