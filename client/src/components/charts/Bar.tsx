import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';
import { createDefaultChartOptions } from './options';
import { ChartProps } from './ChartSelector';
import { separateTimeAndQuestionData } from 'utils/analytics';
import { refornatQuestionPrompt } from 'utils/string';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

type BarChartProps = Omit<ChartProps, 'type'>;

const BarChart = ({ analyticsData, questionPrompt }: BarChartProps) => {
  const [timeLabels, questionData] = separateTimeAndQuestionData(analyticsData);

  const data = {
    labels: timeLabels,
    datasets: [
      {
        label: questionPrompt,
        data: questionData,
        backgroundColor: 'rgba(255, 99, 132, 0.5)',
      },
    ],
  };
  return (
    <div className="d-flex w-100 flex-row justify-content-center" style={{ height: '450px' }}>
      <Bar options={createDefaultChartOptions('Bar Chart')} data={data} />
    </div>
  );
};

export default BarChart;
