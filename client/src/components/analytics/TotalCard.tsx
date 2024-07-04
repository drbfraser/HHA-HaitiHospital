import { Card } from 'react-bootstrap';

type TotalCardProps = {
  department: string;
  question: string;
  value: number;
};
const TotalCard = ({ department, question, value }: TotalCardProps) => {
  return (
    <Card className="shadow-sm" style={{ minWidth: '250px', borderRadius: '16px' }}>
      <Card.Header className="bg-transparent">{department}</Card.Header>
      <Card.Body>
        <Card.Text>
          <h6 className="text-secondary">{question}</h6>
        </Card.Text>
        <Card.Text>
          <h3>{value}</h3>
        </Card.Text>
      </Card.Body>
    </Card>
  );
};

export default TotalCard;
