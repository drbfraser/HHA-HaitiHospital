import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ChartData,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';
import { createDefaultChartOptions } from './options';
import { ChartProps, DataSet } from './ChartSelector';
import {
  findQuestion,
  prepareDataSetForChart,
  translateChartLabel,
  translateTimeCategory,
} from 'utils/analytics';
import GRAPH_COLOR from 'constants/graphColor';
import { useTranslation } from 'react-i18next';
import { formatQuestion, separateDepartmentAndQuestion } from 'utils/string';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

type BarChartProps = Omit<ChartProps, 'type'>;

const BarChart = ({ analyticsData, questionMap, title }: BarChartProps) => {
  const { t } = useTranslation();

  const dataSets = prepareDataSetForChart(analyticsData);

  const data: ChartData<'bar', DataSet[]> = {
    datasets: Object.keys(dataSets).map((label, index) => {
      const translatedLabel = translateChartLabel(label, questionMap);
      return {
        label: translatedLabel,
        data: translateTimeCategory(dataSets[label]),
        // round robin within graph colors
        backgroundColor: GRAPH_COLOR[index % GRAPH_COLOR.length],
        maxBarThickness: 150,
      };
    }),
  };
  return (
    <div className="d-flex w-100 flex-row justify-content-center" style={{ height: '450px' }}>
      <Bar options={createDefaultChartOptions(title)} data={data} />
    </div>
  );
};

export default BarChart;
