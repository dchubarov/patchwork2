import { Theme } from '@mui/joy';
import { ColorLabelPaletteRange } from '@/types/theme';

export function labelColorsByName(
  name: string | null,
  theme: Theme
): ColorLabelPaletteRange {
  const p = name ? theme.palette.colorLabel[name] : undefined;
  return p || theme.palette.neutral;
}
