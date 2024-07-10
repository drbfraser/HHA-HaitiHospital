import { QuestionMap } from 'pages/analytics/Analytics';
import { Card } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { findQuestion } from 'utils/analytics';
import { formatQuestion } from 'utils/string';

type TotalCardProps = {
  department: string;
  questionId: string;
  value: number;
  questionMap: QuestionMap;
};
const TotalCard = ({ department, questionId, value, questionMap }: TotalCardProps) => {
  const { t, i18n } = useTranslation();

  // this is useful as it helps obtain the original question object that contains both french and english translation
  // useful for translating question to french

  const questionPrompt = findQuestion(questionId, questionMap[department]);

  return (
    <Card className="shadow-sm" style={{ minWidth: '250px', borderRadius: '16px' }}>
      <Card.Header className="bg-transparent">{t(`departments.${department}`)}</Card.Header>
      <Card.Body>
        <Card.Text>
          <h6 className="text-secondary">{formatQuestion(questionPrompt, i18n.language)}</h6>
        </Card.Text>
        <Card.Text>
          <h3>{value}</h3>
        </Card.Text>
      </Card.Body>
    </Card>
  );
};

export default TotalCard;
