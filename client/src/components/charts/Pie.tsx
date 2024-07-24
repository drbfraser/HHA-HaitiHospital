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
} from 'chart.js';
import { Pie } from 'react-chartjs-2';
import { ChartProps } from './ChartSelector';
import {
  prepareDataForPieChart,
  prepareLabelsForPieChart,
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

  const questionDataPointTotals = prepareDataForPieChart(analyticsData);
  const labels = prepareLabelsForPieChart(analyticsData, questionMap);

  const data: ChartData<'pie', number[]> = {
    labels,
    datasets: [
      {
        data: questionDataPointTotals,
        backgroundColor: GRAPH_COLOR,
      },
    ],
  };

  return (
    <div className="d-flex w-100 flex-row justify-content-center" style={{ height: '450px' }}>
      <Pie options={createDefaultChartOptions(t('analyticsBarChart'))} data={data} />
    </div>
  );
};

export default PieChart;
