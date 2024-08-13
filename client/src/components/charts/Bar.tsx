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
import { createDefaultChartOptions } from './Options';
import { ChartProps, DataSet } from './ChartSelector';
import {
  prepareDataSetForChart,
  translateChartLabel,
  translateTimeCategory,
} from 'utils/analytics';
import { useTranslation } from 'react-i18next';
import { OPACITY_VALUE_MEDIUM } from 'constants/graphColor';
import { getGraphColors } from 'utils/graphColors';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

type BarChartProps = Omit<ChartProps, 'type'>;

const BarChart = ({ analyticsData, questionMap }: BarChartProps) => {
  const { t } = useTranslation();

  const dataSets = prepareDataSetForChart(analyticsData);
  const graphColors = getGraphColors(OPACITY_VALUE_MEDIUM);

  const data: ChartData<'bar', DataSet[]> = {
    datasets: Object.keys(dataSets).map((label, index) => {
      const translatedLabel = translateChartLabel(label, questionMap);
      return {
        label: translatedLabel,
        data: translateTimeCategory(dataSets[label]),
        // round robin within graph colors
        backgroundColor: graphColors[index % graphColors.length],
        maxBarThickness: 150,
      };
    }),
  };
  return (
    <div className="d-flex w-100 flex-row justify-content-center" style={{ height: '450px' }}>
      <Bar options={createDefaultChartOptions()} data={data} />
    </div>
  );
};

export default BarChart;
