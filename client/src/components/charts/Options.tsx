import {
  Chart,
  ChartData,
  ChartEvent,
  Color,
  LegendElement,
  LegendItem,
  TooltipItem,
  TooltipModel,
} from 'chart.js';
import { Data } from './Pie';

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

export const createPieChartOptions = (chartTitle: string, data: Data) => {
  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      tooltip: {
        callbacks: {
          label: function (tooltipItem: TooltipItem<'pie'>) {
            const label = data.datasets[tooltipItem.datasetIndex].labels[tooltipItem.dataIndex];
            const value = data.datasets[tooltipItem.datasetIndex].data[tooltipItem.dataIndex];

            return `${label}: ${value}`;
          },

          // do not set the title of the tooltip since the label already contains that information
          title: function (tooltipItems: TooltipItem<'pie'>[]) {
            return '';
          },
        },
      },

      legend: {
        labels: {
          generateLabels: function (chart: Chart): LegendItem[] {
            const originalGenerateLabels = Chart.overrides.pie.plugins.legend.labels.generateLabels;

            const labelsOriginal = originalGenerateLabels.call(this, chart);

            let datasetColors = chart.data.datasets.map(function (chartData) {
              return chartData.backgroundColor;
            });

            // array will look like [["Red", "Green"], ["Blue", "Green"]] so flatten it

            datasetColors = datasetColors.flat();

            // there are two data sets:
            // - first: the time data set which is on the outer layer
            // - second: the aggregate data set which is in the inner layer
            // all the labels are in the same list with no way to distinguish between data set
            // so we need to distinguish data set

            labelsOriginal.forEach((label) => {
              label.datasetIndex = 0;

              if (label.index! >= chart.data.datasets[0].data.length) {
                label.datasetIndex = 1;
              }

              //enable user to toggle dataset visibility on or off when user clicks on legend

              label.hidden = !chart.isDatasetVisible(label.datasetIndex);

              label.fillStyle = datasetColors[label.index!] as Color;
            });

            return labelsOriginal;
          },
        },
        position: 'top' as const,
        onClick: function (
          mouseEvent: ChartEvent,
          legendItem: LegendItem,
          legend: LegendElement<'pie'>,
        ) {
          const metaData = legend.chart.getDatasetMeta(legendItem.datasetIndex!);

          //enable user to toggle dataset visibility on or off when user clicks on legend

          metaData.hidden = legend.chart.isDatasetVisible(legendItem.datasetIndex!);

          legend.chart.update();
        },
      },

      title: {
        display: true,
        text: chartTitle,
      },
    },
  };

  return options;
};
