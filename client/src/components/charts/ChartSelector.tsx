import { AnalyticsResponse } from '@hha/common';
import BarChart from './Bar';
import LineChart from './Line';

export type ChartType = 'Bar' | 'Line';

export type ChartProps = {
  type: ChartType;
  analyticsData: AnalyticsResponse[];
  questionPrompt: string;
};
const ChartSelector = ({ type, analyticsData, questionPrompt }: ChartProps) => {
  switch (type) {
    case 'Bar':
      return <BarChart analyticsData={analyticsData} questionPrompt={questionPrompt} />;
    case 'Line':
      return <LineChart analyticsData={analyticsData} questionPrompt={questionPrompt} />;

    default:
      return <BarChart analyticsData={analyticsData} questionPrompt={questionPrompt} />;
  }
};

export default ChartSelector;
