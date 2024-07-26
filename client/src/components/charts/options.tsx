import { TooltipItem, TooltipModel } from 'chart.js';

export const createDefaultChartOptions = (chartTitle: string) => {
  return {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: chartTitle,
      },
    },
  };
};
