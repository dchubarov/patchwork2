import { ColorLabelPaletteRange } from '@/types/theme';
import { useTheme } from '@mui/joy';
import { labelColorsByName } from '@/utils/theme';

export function useLabelColors(
  colorLabel?: string | null
): ColorLabelPaletteRange {
  const theme = useTheme();
  return labelColorsByName(colorLabel ?? null, theme);
}
