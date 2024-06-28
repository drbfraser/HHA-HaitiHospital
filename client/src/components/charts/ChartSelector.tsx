import { AnalyticsResponse } from '@hha/common';
import BarChart from './Bar';
import LineChart from './Line';
import { AnalyticsMap } from 'pages/analytics/Analytics';

export type ChartType = 'Bar' | 'Line';

export type ChartProps = {
  type: ChartType;
  analyticsData: AnalyticsMap;
};

export type DataSet = {
  x: string;
  y: number;
};

export type DataSetMap = {
  [key: string]: DataSet[];
};
const ChartSelector = ({ type, analyticsData }: ChartProps) => {
  switch (type) {
    case 'Bar':
      return <BarChart analyticsData={analyticsData} />;
    case 'Line':
      return <LineChart analyticsData={analyticsData} />;
    default:
      return <BarChart analyticsData={analyticsData} />;
  }
};

export default ChartSelector;
