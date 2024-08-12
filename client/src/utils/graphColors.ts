import { GRAPH_COLOR_NORMAL, OPACITY_VALUE_HIGH, TINT_VALUE } from 'constants/graphColor';
import { AnalyticsMap } from 'pages/analytics/Analytics';

export const duplicateColors = (analyticsData: AnalyticsMap) => {
  let colors: string[] = [];

  const graphColorTint = getGraphTintColors(OPACITY_VALUE_HIGH, TINT_VALUE);

  Object.keys(analyticsData).forEach((departmentQuestionKey, index) => {
    const timeDataLength = analyticsData[departmentQuestionKey].length;

    // each time data set that belongs to a specific question should have the same color
    const duplicateColors = Array<string>(timeDataLength).fill(
      //round robin through colors
      graphColorTint[index % graphColorTint.length],
    );

    colors = colors.concat(duplicateColors);
  });

  return colors;
};

export const getGraphColors = (opacity: number) => {
  return GRAPH_COLOR_NORMAL.map((rgb) => `rgba(${rgb[0]}, ${rgb[1]}, ${rgb[2]}, ${opacity})`);
};

const tintColor = (rgb: number[], tint: number) => {
  const tintRed = rgb[0] + (255 - rgb[0]) * tint;
  const tintGreen = rgb[1] + (255 - rgb[1]) * tint;
  const tintBlue = rgb[2] + (255 - rgb[2]) * tint;

  return [Math.trunc(tintRed), Math.trunc(tintGreen), Math.trunc(tintBlue)];
};

const getGraphTintColors = (opacity: number, tint: number) => {
  const graphColorTint = GRAPH_COLOR_NORMAL.map((rgb) => tintColor(rgb, tint));

  return graphColorTint.map((rgb) => `rgba(${rgb[0]}, ${rgb[1]}, ${rgb[2]}, ${opacity})`);
};
