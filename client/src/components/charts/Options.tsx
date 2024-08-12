import { Chart, ChartEvent, Color, LegendElement, LegendItem, TooltipItem } from 'chart.js';
import { Data } from './Pie';
import { AnalyticsMap, QuestionMap } from 'pages/analytics/Analytics';
import { prepareTimeLabel, translateChartLabel } from 'utils/analytics';

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

export const createPieChartOptions = (
  chartTitle: string,
  data: Data,
  analyticsData: AnalyticsMap,
  questionMap: QuestionMap,
) => {
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

            // the dataset colors will end up looking like [["Red", "Green"], ["Blue", "Green"]],
            //where, the first nested array contains color for the outer layer data set (time data: Feb 2024, May 2024)
            //while, the second nested array contains color for the inner layer data set (aggregate data: Q1 - Beds Available)

            // there are two data sets:
            // - first: the time data set which is on the outer layer
            // - second: the aggregate data set which is in the inner layer
            // all the labels are in the same list with no way to distinguish between data set
            // so we need to distinguish data set

            let labelIndex = 0;

            // used to track the background color for the outer layer data set
            let timeBgColorIndex = 0;

            // we wish to diplay legends in this order: aggregate data 1, time data 1, time data 2, aggregate data 2, time data 1, time data 2
            //eg, Q1-Beds Available, Jan 2024, Feb 2024, Q2-Bed Days, Jan 2024, Feb 2024 ...

            Object.keys(analyticsData).forEach((departmentQuestionKey, index) => {
              const label = labelsOriginal[labelIndex];
              label.datasetIndex = 1;
              label.text = translateChartLabel(departmentQuestionKey, questionMap);
              label.fillStyle = (datasetColors[1] as Color[])[index];
              label.hidden = !chart.isDatasetVisible(label.datasetIndex);
              labelIndex++;

              analyticsData[departmentQuestionKey].forEach((timeData) => {
                const label = labelsOriginal[labelIndex];
                label.datasetIndex = 0;
                label.text = prepareTimeLabel(timeData);
                label.fillStyle = (datasetColors[0] as Color[])[timeBgColorIndex];
                label.hidden = !chart.isDatasetVisible(label.datasetIndex);

                timeBgColorIndex++;
                labelIndex++;
              });
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
