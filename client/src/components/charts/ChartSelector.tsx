import { AnalyticsResponse } from '@hha/common';
import BarChart from './Bar';
import LineChart from './Line';
import { AnalyticsMap, QuestionMap } from 'pages/analytics/Analytics';
import { toast } from 'react-toastify';
import { useTranslation } from 'react-i18next';
import { forwardRef } from 'react';

export type ChartType = 'bar' | 'line';

export type ChartProps = {
  type: ChartType;
  analyticsData: AnalyticsMap;
  questionMap: QuestionMap;
  title: string;
};

export type DataSet = {
  x: string;
  y: number | null;
};

export type DataSetMap = {
  [key: string]: DataSet[];
};

const ChartSelector = ({ type, analyticsData, questionMap, title }: ChartProps) => {
  const { t } = useTranslation();
  switch (type) {
    case 'bar':
      return <BarChart analyticsData={analyticsData} questionMap={questionMap} title={title} />;
    case 'line':
      return <LineChart analyticsData={analyticsData} questionMap={questionMap} title={title} />;
    default:
      toast.warning(t('analyticsInvalidChart'));
      return <BarChart analyticsData={analyticsData} questionMap={questionMap} title={title} />;
  }
};

export default ChartSelector;
