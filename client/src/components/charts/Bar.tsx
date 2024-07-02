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
import { prepareDataSetForChart } from 'utils/analytics';
import GRAPH_COLOR from 'constants/graphColor';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

type BarChartProps = Omit<ChartProps, 'type'>;

const BarChart = ({ analyticsData }: BarChartProps) => {
  const dataSets = prepareDataSetForChart(analyticsData);

  console.log('datasets:', dataSets);
  const data: ChartData<'bar', DataSet[]> = {
    datasets: Object.keys(dataSets).map((label, index) => {
      return {
        label: label,
        data: dataSets[label],
        backgroundColor: GRAPH_COLOR[index],
      };
    }),
  };
  return (
    <div className="d-flex w-100 flex-row justify-content-center" style={{ height: '450px' }}>
      <Bar options={createDefaultChartOptions('Bar Chart')} data={data} />
    </div>
  );
};

export default BarChart;
