import { Dispatch, SetStateAction, useEffect, useState } from 'react';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import { currYear } from 'utils';
import { useTranslation } from 'react-i18next';

const maxYear = currYear;
const minYear = 1900;
interface MonthFieldProps {
  setReportMonth: Dispatch<SetStateAction<Date | undefined>>;
  previousReportMonth?: Date;
}

export const MonthField = ({ setReportMonth, previousReportMonth }: MonthFieldProps) => {
  const [month, setMonth] = useState<number | undefined>(
    previousReportMonth?.getMonth() ?? undefined,
  );
  const [year, setYear] = useState<number | undefined>(
    previousReportMonth?.getUTCFullYear() ?? undefined,
  );
  const { t } = useTranslation();

  useEffect(() => {
    if (month && month >= 0 && year && year >= minYear && year <= currYear) {
      setReportMonth(new Date(year, month));
    }
  }, [month, setReportMonth, year]);

  return (
    <div className="mt-3">
      <Row>
        <Col>
          <Form.Group className="mb-3">
            <Form.Label htmlFor="month">{t('month')}</Form.Label>
            <Form.Select
              id="month"
              name="month"
              value={month}
              onChange={(e) => setMonth(parseInt(e.target.value))}
            >
              <option value={-1}>{t('monthSelect')}</option>
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
          <Form.Group className="mb-3">
            <Form.Label htmlFor="year">{t('year')}</Form.Label>
            <Form.Control
              type="number"
              id="year"
              name="year"
              min="1900"
              max={currYear}
              value={year ?? currYear}
              onChange={(e) => setYear(parseInt(e.target.value))}
              step="1"
              isInvalid={year !== undefined && (year < minYear || year > maxYear)}
              placeholder={t('yearPlaceholder')}
            />
          </Form.Group>
        </Col>
      </Row>
    </div>
  );
};
