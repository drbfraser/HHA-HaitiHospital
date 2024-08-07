import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ChartData,
  ArcElement,
  TooltipItem,
  LegendOptions,
  Chart,
  LegendItem,
  Color,
  ChartEvent,
  ActiveElement,
  LegendElement,
} from 'chart.js';
import { Pie } from 'react-chartjs-2';
import { ChartProps } from './ChartSelector';
import {
  prepareAggregateData,
  prepareAggregateLabels,
  prepareAnalyticsAnswers as prepareAnalyticsResponses,
  prepareResponseLabels,
  sumUpAnalyticsData,
  translateChartLabel,
} from 'utils/analytics';
import { AnalyticsResponse } from '@hha/common';
import { ALPHA_VALUE_HIGH, duplicateColor, getGraphColors } from 'constants/graphColor';
import { createDefaultChartOptions } from './options';
import { useTranslation } from 'react-i18next';

ChartJS.register(CategoryScale, LinearScale, BarElement, ArcElement, Title, Tooltip, Legend);

type PieChartProps = Omit<ChartProps, 'type'>;

const PieChart = ({ analyticsData, questionMap }: PieChartProps) => {
  const { t } = useTranslation();

  const aggregateData = prepareAggregateData(analyticsData);
  const responsesData = prepareAnalyticsResponses(analyticsData);
  const aggregateLabels = prepareAggregateLabels(analyticsData, questionMap);
  const responseLabels = prepareResponseLabels(responsesData, analyticsData, questionMap);
  const colors = duplicateColor(analyticsData);

  const data = {
    labels: responseLabels.concat(aggregateLabels),
    datasets: [
      {
        data: responsesData.map((responseData) => responseData.answer),
        backgroundColor: colors,
        borderWidth: 1,
        labels: responseLabels,
      },
      {
        data: aggregateData,
        backgroundColor: getGraphColors(ALPHA_VALUE_HIGH),
        borderWidth: 1,
        labels: aggregateLabels,
      },
    ],
  };

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

          title: function (tooltipItems: TooltipItem<'pie'>[]) {
            return '';
          },
        },
      },

      legend: {
        labels: {
          generateLabels: function (chart: Chart): LegendItem[] {
            const original = Chart.overrides.pie.plugins.legend.labels.generateLabels;

            const labelsOriginal = original.call(this, chart);

            let datasetColors = chart.data.datasets.map(function (chartData) {
              return chartData.backgroundColor;
            });

            datasetColors = datasetColors.flat();

            labelsOriginal.forEach((label) => {
              label.datasetIndex = 0;

              if (label.index! >= chart.data.datasets[0].data.length) {
                label.datasetIndex = 1;
              }

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

          metaData.hidden = legend.chart.isDatasetVisible(legendItem.datasetIndex!);

          legend.chart.update();
        },
      },

      title: {
        display: true,
        text: 'Pie Chart',
      },
    },
  };

  return (
    <div className="d-flex flex-row justify-content-center w-100" style={{ height: '550px' }}>
      <Pie options={options} data={data} style={{ width: '100%', height: '550px' }} />
    </div>
  );
};

export default PieChart;
