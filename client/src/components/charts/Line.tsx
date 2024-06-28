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
import { createDefaultChartOptions } from './options';
import { ChartProps, DataSet } from './ChartSelector';
import { reformatQuestionPrompt } from 'utils/string';
import { prepareDataSetForChart } from 'utils/analytics';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

type LineChartProps = Omit<ChartProps, 'type'>;

const LineChart = ({ analyticsData }: LineChartProps) => {
  const dataSets = prepareDataSetForChart(analyticsData);
  const data: ChartData<'line', DataSet[]> = {
    datasets: Object.keys(dataSets).map((label) => {
      return {
        label: label,
        data: dataSets[label],
        backgroundColor: 'rgba(255, 99, 132, 0.5)',
      };
    }),
  };
  return (
    <div className="d-flex w-100 flex-row justify-content-center" style={{ height: '450px' }}>
      <Line options={createDefaultChartOptions('Line Chart')} data={data} />
    </div>
  );
};

export default LineChart;
