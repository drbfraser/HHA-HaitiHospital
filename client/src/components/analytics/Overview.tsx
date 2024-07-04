import { Col, Row, Stack } from 'react-bootstrap';
import { Container } from 'react-bootstrap';
import TotalCard from './TotalCard';
import { AnalyticsMap } from 'pages/analytics/Analytics';
import { sumUpAnalyticsData } from 'utils/analytics';
import { separateDepartmentAndQuestion } from 'utils/string';

type AnalyticsOverviewProps = {
  analyticsData: AnalyticsMap;
};
const AnalyticsOverview = ({ analyticsData }: AnalyticsOverviewProps) => {
  return (
    <Container>
      <Col>
        <h4 className="text-secondary">Total</h4>
        <div className="d-flex flex-row" style={{ gap: '15px', overflowX: 'auto' }}>
          {Object.keys(analyticsData).map((departmentQuestion, index) => {
            const [department, question] = separateDepartmentAndQuestion(departmentQuestion);

            return (
              <TotalCard
                key={index}
                question={question}
                department={department}
                value={sumUpAnalyticsData(analyticsData[departmentQuestion])}
              />
            );
          })}
        </div>
      </Col>
    </Container>
  );
};

export default AnalyticsOverview;
