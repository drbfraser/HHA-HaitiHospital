import { Col } from 'react-bootstrap';
import { Container } from 'react-bootstrap';
import TotalCard from './TotalCard';
import { AnalyticsMap, QuestionMap } from 'pages/analytics/Analytics';
import { sumUpAnalyticsData } from 'utils/analytics';
import { separateDepartmentAndQuestion } from 'utils/string';
import { useTranslation } from 'react-i18next';

type AnalyticsOverviewProps = {
  analyticsData: AnalyticsMap;
  questionMap: QuestionMap;
};
const AnalyticsTotal = ({ analyticsData, questionMap }: AnalyticsOverviewProps) => {
  const { t } = useTranslation();

  return (
    <Container className="mx-0" fluid>
      <Col>
        <h4 className="text-secondary">{t('analyticsTotal')}</h4>
        <div className="d-flex flex-wrap w-100 mb-3" style={{ gap: '15px' }}>
          {Object.keys(analyticsData).map((departmentPlusQuestion, index) => {
            const [department, questionId] = separateDepartmentAndQuestion(departmentPlusQuestion);

            return (
              <TotalCard
                key={index}
                questionId={questionId}
                department={department}
                value={sumUpAnalyticsData(analyticsData[departmentPlusQuestion])}
                questionMap={questionMap}
              />
            );
          })}
        </div>
      </Col>
    </Container>
  );
};

export default AnalyticsTotal;
