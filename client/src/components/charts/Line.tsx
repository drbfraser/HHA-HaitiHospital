import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ChartData,
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import { createDefaultChartOptions } from './Options';
import { ChartProps, DataSet } from './ChartSelector';
import {
  prepareDataSetForChart,
  translateChartLabel,
  translateTimeCategory,
} from 'utils/analytics';
import { useTranslation } from 'react-i18next';
import { ALPHA_VALUE_MEDIUM, getGraphColors } from 'constants/graphColor';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

type LineChartProps = Omit<ChartProps, 'type'>;

const LineChart = ({ analyticsData, questionMap }: LineChartProps) => {
  const { t } = useTranslation();

  const dataSets = prepareDataSetForChart(analyticsData);
  const graphColors = getGraphColors(ALPHA_VALUE_MEDIUM);

  const data: ChartData<'line', DataSet[]> = {
    datasets: Object.keys(dataSets).map((label, index) => {
      const translatedLabel = translateChartLabel(label, questionMap);

      return {
        label: translatedLabel,
        data: translateTimeCategory(dataSets[label]),
        borderColor: graphColors[index % graphColors.length],
      };
    }),
  };
  return (
    <div className="d-flex w-100 flex-row justify-content-center" style={{ height: '450px' }}>
      <Line options={createDefaultChartOptions(t('analyticsLineChart'))} data={data} />
    </div>
  );
};

export default LineChart;
