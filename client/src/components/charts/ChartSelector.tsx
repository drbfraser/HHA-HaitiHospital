import { AnalyticsResponse, QuestionPrompt } from '@hha/common';
import BarChart from './Bar';
import LineChart from './Line';
import PieChart from './Pie';

export type ChartProps = {
  type: string;
  analyticsData: AnalyticsResponse[];
  questionPrompt: string;
};
const ChartSelector = ({ type, analyticsData, questionPrompt }: ChartProps) => {
  switch (type) {
    case 'Bar':
      return <BarChart analyticsData={analyticsData} questionPrompt={questionPrompt} />;
    case 'Line':
      return <LineChart analyticsData={analyticsData} questionPrompt={questionPrompt} />;

    case 'Pie':
      return <PieChart analyticsData={analyticsData} questionPrompt={questionPrompt} />;

    default:
      return <BarChart analyticsData={analyticsData} questionPrompt={questionPrompt} />;
  }
};

export default ChartSelector;
