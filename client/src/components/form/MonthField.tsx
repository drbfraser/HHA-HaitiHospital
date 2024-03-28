import { Dispatch, SetStateAction, useState } from 'react';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import { currMonth, currYear } from 'utils';
import { useTranslation } from 'react-i18next';

interface MonthFieldProps {
  setReportMonth: Dispatch<SetStateAction<Date | undefined>>;
  reportMonth: Date | undefined;
}

export const MonthField = () => {
  const [month, setMonth] = useState<number>(currMonth);
  const [year, setYear] = useState<number>(currYear);
  const [reportMonth, setReportMonth] = useState<Date | undefined>();
  const { t } = useTranslation();

  return (
    <div className="">
      <Row>
        <Col>
          <Form.Group className="mb-3" controlId="month">
            <Form.Label htmlFor="month">{t('month')}</Form.Label>
            <Form.Select id="month" name="month">
              <option value={0}>{t('monthJanuary')}</option>
              <option value={1}>{t('monthFebruary')}</option>
              <option value={2}>{t('monthMarch')}</option>
              <option value={3}>{t('monthApril')}</option>
              <option value={4}>{t('monthMay')}</option>
              <option value={5}>{t('monthJune')}</option>
              <option value={6}>{t('monthJuly')}</option>
              <option value={7}>{t('monthAugust')}</option>
              <option value={8}>{t('monthSeptember')}</option>
              <option value={9}>{t('monthOctober')}</option>
              <option value={10}>{t('monthNovember')}</option>
              <option value={11}>{t('monthDecember')}</option>
            </Form.Select>
          </Form.Group>
        </Col>
        <Col>
          <Form.Group className="mb-3" controlId="year">
            <Form.Label htmlFor="year">{t('year')}</Form.Label>
            <Form.Control
              type="number"
              id="year"
              name="year"
              min="1900"
              max={year}
              defaultValue={year}
              step="1"
            />
          </Form.Group>
        </Col>
      </Row>
    </div>
  );
};
