import { AnalyticsMap } from 'pages/analytics/Analytics';

export const ALPHA_VALUE_MEDIUM = 0.5;
export const ALPHA_VALUE_HIGH = 0.7;

export const duplicateColor = (analyticsData: AnalyticsMap) => {
  let colors: string[] = [];

  const graphColorTint = getGraphTintColors(ALPHA_VALUE_HIGH);

  Object.keys(analyticsData).forEach((departmentQuestionKey, index) => {
    const analyticsResponseLength = analyticsData[departmentQuestionKey].length;

    const duplicateColors = Array(analyticsResponseLength).fill(
      graphColorTint[index % graphColorTint.length],
    );

    colors = colors.concat(duplicateColors);
  });

  return colors;
};

export const getGraphColors = (alpha: number) => {
  const GRAPH_COLOR_NORMAL = [
    `rgba(230, 0, 73, ${alpha})`,
    `rgba(11, 180, 255,  ${alpha})`,
    `rgba(80, 233, 145, ${alpha})`,
    `rgba(230, 216, 0, ${alpha})`,
    `rgba(155, 25, 245, ${alpha})`,
    `rgba(255, 163, 0, ${alpha})`,
    `rgba(220, 10, 180, ${alpha})`,
    `rgba(179, 212, 255, ${alpha})`,
    `rgba(0, 191, 160, ${alpha})`,
  ];

  return GRAPH_COLOR_NORMAL;
};

export const getGraphTintColors = (alpha: number) => {
  const GRAPH_COLOR_TINT = [
    `rgba(238, 77, 128, ${alpha})`,
    `rgba(84, 203, 255, ${alpha})`,
    `rgba(133, 240, 178, ${alpha})`,
    `rgba(238, 228, 77, ${alpha})`,
    `rgba(185, 94, 248, ${alpha})`,
    `rgba(255, 191, 77, ${alpha})`,
    `rgba(231, 84, 203, ${alpha})`,
    `rgba(202, 225, 255, ${alpha})`,
    `rgba(77, 210, 189, ${alpha})`,
  ];

  return GRAPH_COLOR_TINT;
};
