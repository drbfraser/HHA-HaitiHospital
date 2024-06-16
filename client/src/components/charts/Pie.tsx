import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Pie } from 'react-chartjs-2';
import { createDefaultChartOptions } from './options';
import { ChartProps } from './ChartSelector';

ChartJS.register(ArcElement, Tooltip, Legend);

const data = {
  labels: ['Rehab', 'NICU/Paeds', 'Maternity', 'Community'],
  datasets: [
    {
      label: 'Department distribution',
      data: [12, 9, 6, 2],
      backgroundColor: [
        'rgba(255, 99, 132, 0.2)',
        'rgba(54, 162, 235, 0.2)',
        'rgba(255, 206, 86, 0.2)',
        'rgba(75, 192, 192, 0.2)',
      ],

      borderColor: [
        'rgba(255, 99, 132, 0.2)',
        'rgba(54, 162, 235, 0.2)',
        'rgba(255, 206, 86, 0.2)',
        'rgba(75, 192, 192, 0.2)',
      ],

      borderWidth: 1,
    },
  ],
};

type PieChartProps = Omit<ChartProps, 'type'>;

const PieChart = ({ analyticsData }: PieChartProps) => {
  return (
    <div className="d-flex w-100 flex-row justify-content-center" style={{ height: '450px' }}>
      <Pie data={data} options={createDefaultChartOptions('Pie Chart')} />
    </div>
  );
};

export default PieChart;
