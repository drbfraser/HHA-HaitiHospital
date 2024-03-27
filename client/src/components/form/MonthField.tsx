import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';

export const MonthField = ({}) => (
  <div className="">
    <Row>
      <Col>
        <Form.Group className="mb-3" controlId="month">
          <Form.Label htmlFor="month">Month:</Form.Label>
          <Form.Select id="month" name="month" defaultValue={new Date().getMonth()}>
            <option value={1}>January</option>
            <option value={2}>February</option>
            <option value={3}>March</option>
            <option value={4}>April</option>
            <option value={5}>May</option>
            <option value={6}>June</option>
            <option value={7}>July</option>
            <option value={8}>August</option>
            <option value={9}>September</option>
            <option value={10}>October</option>
            <option value={11}>November</option>
            <option value={12}>December</option>
          </Form.Select>
        </Form.Group>
      </Col>
      <Col>
        <Form.Group className="mb-3" controlId="year">
          <Form.Label htmlFor="year">Year:</Form.Label>
          <Form.Control
            type="number"
            id="year"
            name="year"
            min="1900"
            max={new Date().getFullYear()}
            defaultValue={new Date().getFullYear()}
            step="1"
          />
        </Form.Group>
      </Col>
    </Row>
  </div>
);
