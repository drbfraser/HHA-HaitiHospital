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
};

export type DataSet = {
  x: string;
  y: number | null;
};

export type DataSetMap = {
  [key: string]: DataSet[];
};

const ChartSelector = forwardRef<HTMLDivElement, ChartProps>(
  ({ type, analyticsData, questionMap }, ref): JSX.Element => {
    const { t } = useTranslation();
    switch (type) {
      case 'bar':
        return <BarChart analyticsData={analyticsData} questionMap={questionMap} />;
      case 'line':
        return <LineChart analyticsData={analyticsData} questionMap={questionMap} />;
      default:
        toast.warning(t('analyticsInvalidChart'));
        return <BarChart analyticsData={analyticsData} questionMap={questionMap} />;
    }
  },
);

export default ChartSelector;
