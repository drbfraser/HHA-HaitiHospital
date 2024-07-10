import { AnalyticsResponse } from '@hha/common';
import BarChart from './Bar';
import LineChart from './Line';
import { AnalyticsMap, QuestionMap } from 'pages/analytics/Analytics';

export type ChartType = 'bar' | 'line';

export type ChartProps = {
  type: ChartType;
  analyticsData: AnalyticsMap;
  questionMap: QuestionMap;
};

export type DataSet = {
  x: string;
  y: number | null;
};

export type DataSetMap = {
  [key: string]: DataSet[];
};
const ChartSelector = ({ type, analyticsData, questionMap }: ChartProps) => {
  switch (type) {
    case 'bar':
      return <BarChart analyticsData={analyticsData} questionMap={questionMap} />;
    case 'line':
      return <LineChart analyticsData={analyticsData} questionMap={questionMap} />;
    default:
      return <BarChart analyticsData={analyticsData} questionMap={questionMap} />;
  }
};

export default ChartSelector;
