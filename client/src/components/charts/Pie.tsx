import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from 'chart.js';
import { Pie } from 'react-chartjs-2';
import { ChartProps } from './ChartSelector';
import {
  prepareAggregateData,
  prepareAggregateLabels,
  prepareTimeData,
  prepareTimeLabels,
} from 'utils/analytics';
import { OPACITY_VALUE_HIGH } from 'constants/graphColor';
import { useTranslation } from 'react-i18next';
import { createPieChartOptions } from './Options';
import { duplicateColors, getGraphColors } from 'utils/graphColors';

ChartJS.register(CategoryScale, LinearScale, BarElement, ArcElement, Title, Tooltip, Legend);

type PieChartProps = Omit<ChartProps, 'type'>;

export type Data = {
  labels: string[];
  datasets: {
    data: number[];
    backgroundColor: string[];
    borderWidth: number;
    labels: string[];
  }[];
};

const PieChart = ({ analyticsData, questionMap }: PieChartProps) => {
  const { t } = useTranslation();

  const aggregateData = prepareAggregateData(analyticsData);
  const analyticsTimeData = prepareTimeData(analyticsData);
  const aggregateLabels = prepareAggregateLabels(analyticsData, questionMap);
  const timeLabels = prepareTimeLabels(analyticsTimeData);
  const colors = duplicateColors(analyticsData);

  const data: Data = {
    //gather all labels to be displayed as a legend

    labels: timeLabels.concat(aggregateLabels),

    // there are two data sets:
    // - first: the time data set which is on the outer layer
    // - second: the aggregate data set which is in the inner layer
    datasets: [
      {
        data: analyticsTimeData.map((timeData) => timeData.answer),
        backgroundColor: colors,
        borderWidth: 1,
        labels: timeLabels,
      },
      {
        data: aggregateData,
        backgroundColor: getGraphColors(OPACITY_VALUE_HIGH),
        borderWidth: 1,
        labels: aggregateLabels,
      },
    ],
  };

  return (
    <div className="d-flex flex-row justify-content-center w-100" style={{ height: '550px' }}>
      <Pie
        options={createPieChartOptions(t('analyticsPieChart'), data, analyticsData, questionMap)}
        data={data}
        style={{ width: '100%', height: '550px' }}
      />
    </div>
  );
};

export default PieChart;
