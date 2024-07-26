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
import GRAPH_COLOR from 'constants/graphColor';
import { createDefaultChartOptions } from './options';
import { useTranslation } from 'react-i18next';

ChartJS.register(CategoryScale, LinearScale, BarElement, ArcElement, Title, Tooltip, Legend);

type PieChartProps = Omit<ChartProps, 'type'>;

const PieChart = ({ analyticsData, questionMap }: PieChartProps) => {
  const { t } = useTranslation();

  const aggregateData = prepareAggregateData(analyticsData);
  const responsesData = prepareAnalyticsResponses(analyticsData);
  const aggregateLabels = prepareAggregateLabels(analyticsData, questionMap);
  const responseLabels = prepareResponseLabels(responsesData);

  const data = {
    datasets: [
      {
        data: responsesData.map((responseData) => responseData.answer),
        backgroundColor: GRAPH_COLOR,
        borderWidth: 1,
        labels: responseLabels,
      },
      {
        data: aggregateData,
        backgroundColor: GRAPH_COLOR,
        borderWidth: 1,
        labels: aggregateLabels,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      tooltip: {
        callbacks: {
          label: function (tooltipItem: TooltipItem<'pie'>) {
            const label = data.datasets[tooltipItem.datasetIndex].labels[tooltipItem.dataIndex];
            const value = data.datasets[tooltipItem.datasetIndex].data[tooltipItem.dataIndex];

            return `${label}: ${value}`;
          },
        },
      },
    },
  };

  return (
    <div className="d-flex w-100 flex-row justify-content-center" style={{ height: '450px' }}>
      <Pie options={options} data={data} />
    </div>
  );
};

export default PieChart;
